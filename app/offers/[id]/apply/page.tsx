"use client";
import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { applicationsApi } from "@/services/api";

export default function ApplyPage() {
  const params = useParams();
  const offerId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cv) {
      setMessage("Please upload your CV.");
      return;
    }
    if (!offerId) {
      setMessage("Offer ID is missing.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await applicationsApi.applyToOffer(cv, offerId);
      setMessage("✅ Application submitted successfully!");
    } catch (err: any) {
      setMessage(err.message || "Error submitting application.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-cyan-800 text-center">Submit your application</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full items-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={e => setCv(e.target.files?.[0] || null)}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="px-6 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold hover:bg-cyan-200 transition"
          >
            {cv ? "CV selected: " + cv.name : "Upload your CV"}
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-cyan-700 text-white rounded-full font-semibold hover:bg-cyan-800 transition text-lg"
            disabled={loading}
          >
            {loading ? "Applying..." : "Submit Application"}
          </button>
          {message && (
            <div className={`mt-2 text-center font-semibold ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
