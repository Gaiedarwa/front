'use client';
import React, { useCallback, useState } from "react";
import {jobOffersApi} from "@/services/api";
type FileDropZoneProps = {
    onFileAccepted?: (file: File) => void;
};

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileAccepted }) => {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragActive(false);
            setError(null);

            const file = e.dataTransfer.files[0];
            if (file && file.type === "application/pdf") {
                setFileName(file.name);
                onFileAccepted?.(file);
            } else {
                setError("Please upload a PDF file.");
                setFileName(null);
            }
        },
        [onFileAccepted]
    );

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setFileName(file.name);
            onFileAccepted?.(file);
        } else {
            setError("Please upload a PDF file.");
            setFileName(null);
        }
    };

    return (
        <div className="py-15">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                    border: "2px dashed #888",
                    borderRadius: 8,
                    padding: 32,
                    textAlign: "center",
                    background: dragActive ? "#f0f0f0" : "#fff",
                    cursor: "pointer",
                }}
                onClick={() => document.getElementById("pdf-input")?.click()}
            >
                <input
                    id="pdf-input"
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                {fileName ? (
                    <div>Selected file: {fileName}</div>
                ) : (
                    <div>
                        Drag & drop a PDF file here, or <span style={{ color: "#0070f3", textDecoration: "underline" }}>browse</span>
                    </div>
                )}

            </div>
            <button
                type="button"
                disabled={!fileName}
                style={{
                    marginTop: 16,
                    padding: "8px 24px",
                    background: "#0070f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: fileName ? "pointer" : "not-allowed",
                    opacity: fileName ? 1 : 0.6,
                }}
                onClick={async () => {
                    setError(null);
                    const input = document.getElementById("pdf-input") as HTMLInputElement | null;
                    const file = input?.files?.[0];
                    if (!file) {
                        setError("Please select a PDF file before submitting.");
                        return;
                    }
                    try {
                        await jobOffersApi.create(file);
                        setFileName(null);
                        if (input) input.value = "";
                        alert("PDF uploaded successfully!");
                    } catch (err) {
                        setError("Failed to upload PDF. Please try again.");
                    }
                }}
            >
                Submit PDF
            </button>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>
    );
};

export default FileDropZone;