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
    const [success, setSuccess] = useState<boolean>(false);

    const isAcceptedFile = (file: File) => {
        return (
            file.type === "application/pdf" ||
            file.type === "image/jpeg" ||
            file.type === "image/jpg"
        );
    };

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setDragActive(false);
            setError(null);

            const file = e.dataTransfer.files[0];
            if (file && isAcceptedFile(file)) {
                setFileName(file.name);
                onFileAccepted?.(file);
            } else {
                setError("Please upload a PDF or JPG file.");
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
        if (file && isAcceptedFile(file)) {
            setFileName(file.name);
            onFileAccepted?.(file);
        } else {
            setError("Please upload a PDF or JPG file.");
            setFileName(null);
        }
    };

    return (
        <div className="py-15">
            <h2 className="text-2xl font-bold mb-4 text-center">Create a Job Offer</h2>
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
                onClick={() => document.getElementById("offer-input")?.click()}
            >
                <input
                    id="offer-input"
                    type="file"
                    accept="application/pdf,image/jpeg,image/jpg"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                {fileName ? (
                    <div>Selected file: {fileName}</div>
                ) : (
                    <div>
                        Drag & drop a PDF or JPG file here, or <span style={{ color: "#0070f3", textDecoration: "underline" }}>browse</span>
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
                    setSuccess(false);
                    const input = document.getElementById("offer-input") as HTMLInputElement | null;
                    const file = input?.files?.[0];
                    if (!file) {
                        setError("Please select a PDF or JPG file before submitting.");
                        return;
                    }
                    try {
                        await jobOffersApi.create(file);
                        setFileName(null);
                        if (input) input.value = "";
                        setSuccess(true);
                    } catch (err) {
                        setError("Failed to upload file. Please try again.");
                    }
                }}
            >
                Submit Offer
            </button>
            {success && (
                <div style={{ color: "green", marginTop: 8 }}>
                    Offer uploaded successfully!
                    <div className="mt-2">
                        <a href="/dashboard/rh" style={{ color: "#0070f3", textDecoration: "underline" }}>Back to Job Offers</a>
                    </div>
                </div>
            )}
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </div>
    );
};

export default FileDropZone;