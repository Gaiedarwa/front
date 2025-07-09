import Link from "next/link";
import { jobOffersApi } from "@/services/api";

export default async function OffersPage() {
  let offers: any[] = [];
  let error: string | null = null;
  try {
    offers = await jobOffersApi.getAll();
  } catch (e: any) {
    error = e.message || "Error fetching job offers.";
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-10 text-cyan-800 text-center">All Job Offers</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid gap-8">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border hover:shadow-2xl transition"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h2 className="text-2xl font-bold text-cyan-700">{offer.title}</h2>
              <span className="text-sm text-gray-500">{offer.company} {offer.location && `- ${offer.location}`}</span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              {offer.contract_type && (
                <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {offer.contract_type}
                </span>
              )}
              {offer.work_type && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {offer.work_type}
                </span>
              )}
              {offer.level && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                  {offer.level}
                </span>
              )}
            </div>
            <p className="text-gray-700 mt-2 line-clamp-3">
              {typeof offer.description === "string" ? offer.description : ""}
            </p>
            {offer.job_summary && (
              <pre>{JSON.stringify(offer.job_summary, null, 2)}</pre>
            )}
            <div className="flex justify-end mt-4">
              <Link
                href={`/offers/${offer._id}`}
                className="px-6 py-2 bg-cyan-700 text-white rounded-full font-semibold hover:bg-cyan-800 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}