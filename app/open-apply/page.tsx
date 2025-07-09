"use client";
import React, { useState } from "react";
import { applicationsApi } from "@/services/api";

export default function OpenApplyPage() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setMessage("Please select a CV file.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await applicationsApi.applyOpen(cvFile);
      setMessage("Your open application has been submitted successfully!");
      setCvFile(null);
    } catch (err: any) {
      setMessage(err.message || "An error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-transparent">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-2 text-[#007a99]">Open apply</h1>
        <p className="mb-6 text-[#007a99]">
          You can submit an open application by uploading your CV below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="cv-upload"
              className="block w-full cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded border border-gray-300 text-center transition"
            >
              {cvFile ? `Selected file: ${cvFile.name}` : "Choose a file"}
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-[#007a99] hover:bg-[#005f73] transition-colors text-white font-semibold px-4 py-2 rounded shadow disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit CV"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-[#007a99] font-medium">{message}</div>
        )}
      </div>
    </div>
  );
}
