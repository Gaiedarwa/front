// app/dashboard/rh/Candidatures.tsx
import React, { useEffect, useState } from "react";
import { applicationsApi, Postulation } from "@/services/api";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  // Add more statuses if needed
};

export default function CandidaturesDashboard() {
  const [applications, setApplications] = useState<Postulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Postulation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    applicationsApi.getAll()
      .then(setApplications)
      .catch(() => setError("Failed to load applications."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await applicationsApi.delete(id);
        setApplications(apps => apps.filter(app => app._id !== id));
      } catch (err) {
        setError("Failed to delete application.");
      }
    }
  };

  const handleView = (app: Postulation) => {
    setSelected(app);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <div className="w-full p-8">
    
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Applications List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Email</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Phone</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Type</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Status</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Matching Score</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="even:bg-gray-50 hover:bg-blue-50 transition">
                    <td className="px-4 py-2">{app.candidate?.name ?? "-"}</td>
                    <td className="px-4 py-2">{app.candidate?.email ?? "-"}</td>
                    <td className="px-4 py-2">{app.candidate?.phone ?? "-"}</td>
                    <td className="px-4 py-2 capitalize">{app.type}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] || "bg-gray-200 text-gray-700"}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {app.match_details?.overall_score
                        ?? app.match_results?.[0]?.score
                        ?? "-"}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleView(app)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                      >
                        View
                      </button>
                      <a
                        href={applicationsApi.getCVUrl(app._id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                      >
                        Download CV
                      </a>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">No applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal for viewing details */}
      {modalOpen && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
            <h3 className="text-xl font-bold mb-4">Application Details</h3>
            <div className="mb-2"><strong>Name:</strong> {selected.candidate?.name ?? "-"}</div>
            <div className="mb-2"><strong>Email:</strong> {selected.candidate?.email ?? "-"}</div>
            <div className="mb-2"><strong>Phone:</strong> {selected.candidate?.phone ?? "-"}</div>
            <div className="mb-2"><strong>Type:</strong> {selected.type}</div>
            <div className="mb-2"><strong>Status:</strong> {selected.status}</div>
            <div className="mb-2">
              <strong>Matching Score:</strong> {selected.match_details?.overall_score ?? selected.match_results?.[0]?.score ?? "-"}
            </div>
            <div className="mb-2">
              <strong>Test Score:</strong> {selected.test_results?.score_percent ?? "-"}
            </div>
            <div className="mb-2"><strong>Skills:</strong> {selected.cv_analysis?.skills?.join(", ") ?? "-"}</div>
            <div className="mb-2"><strong>Summary:</strong> {selected.cv_analysis?.summary ?? "-"}</div>
            {/* Add more details as needed */}
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button>
            {selected && (
              <a
                href={applicationsApi.getCVUrl(selected._id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline ml-2"
              >
                Download CV
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}