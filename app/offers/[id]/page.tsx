import Link from "next/link";
import { jobOffersApi } from "@/services/api";

const HIDDEN_FIELDS = ["_id", "test_generation_status", "test_id", "original_file_path"];

export default async function OfferDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  let offer: any = null;
  let error: string | null = null;
  try {
    offer = await jobOffersApi.getById(id);
  } catch (e: any) {
    error = e.message || "Error fetching offer details.";
  }

  if (error) {
    return <div className="max-w-2xl mx-auto py-16 px-4 text-red-500">{error}</div>;
  }
  if (!offer) {
    return <div className="max-w-2xl mx-auto py-16 px-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 text-cyan-800">{offer.title}</h1>
      <div className="space-y-3">
        {Object.entries(offer).map(([key, value]) => {
          if (HIDDEN_FIELDS.includes(key) || key === "title") return null;
          if (key === "file_url" && typeof value === "string") {
            return (
              <div key={key}>
                <span className="font-semibold text-cyan-700">File:</span>{" "}
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-700 underline">
                  View file
                </a>
              </div>
            );
          }
          if (Array.isArray(value) && value.length > 0) {
            return (
              <div key={key}>
                <span className="font-semibold capitalize">{key.replace(/_/g, " ")}:</span>
                <ul className="list-disc ml-6 text-gray-700">
                  {value.map((item, idx) => (
                    <li key={idx}>{typeof item === "object" ? JSON.stringify(item) : item}</li>
                  ))}
                </ul>
              </div>
            );
          }
          if (typeof value === "object" && value !== null) {
            return (
              <div key={key}>
                <span className="font-semibold capitalize">{key.replace(/_/g, " ")}:</span>
                <pre className="bg-gray-100 rounded p-2 text-sm">{JSON.stringify(value, null, 2)}</pre>
              </div>
            );
          }
          // Champs principaux en gras/couleur
          if (["company", "contract_type", "level", "location"].includes(key)) {
            return (
              <div key={key}>
                <span className="font-semibold text-cyan-700">{key.replace(/_/g, " ")}:</span>{" "}
                <span className="text-gray-800">{String(value)}</span>
              </div>
            );
          }
          // Description en plus gros
          if (key === "description") {
            return (
              <div key={key}>
                <span className="font-semibold text-cyan-700">description:</span>{" "}
                <span className="text-gray-800">{String(value)}</span>
              </div>
            );
          }
          // Autres champs
          return (
            <div key={key}>
              <span className="font-semibold capitalize">{key.replace(/_/g, " ")}:</span>{" "}
              <span className="text-gray-700">{String(value)}</span>
            </div>
          );
        })}
      </div>
      <Link
        href={`/offers/${offer._id}/apply`}
        className="mt-8 px-8 py-3 bg-cyan-700 text-white rounded-full font-semibold hover:bg-cyan-800 transition block text-center w-fit mx-auto"
      >
        Apply now
      </Link>
    </div>
  );
}