'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { jobOffersApi, JobOffer } from '@/services/api';

export default function OfferDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    jobOffersApi.getById(id)
      .then(setOffer)
      .catch((e) => setError(e.message || 'Error loading offer'));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-red-500">
        {error}
      </div>
    );
  }
  if (!offer) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 bg-white rounded-xl shadow">
      <h1 className="text-4xl font-bold mb-6 text-cyan-800">{offer.title}</h1>
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-cyan-700">Company:</span>{' '}
          <span className="text-gray-800">{offer.company}</span>
        </div>
        <div>
          <span className="font-semibold text-cyan-700">Contract Type:</span>{' '}
          <span className="text-gray-800">{offer.contract_type}</span>
        </div>
        <div>
          <span className="font-semibold text-cyan-700">Work Type:</span>{' '}
          <span className="text-gray-800">{offer.work_type}</span>
        </div>
        <div>
          <span className="font-semibold text-cyan-700">Level:</span>{' '}
          <span className="text-gray-800">{offer.level}</span>
        </div>
        <div>
          <span className="font-semibold text-cyan-700">Location:</span>{' '}
          <span className="text-gray-800">{offer.location}</span>
        </div>
        <div>
          <span className="font-semibold text-cyan-700">Skills:</span>
          <ul className="list-disc ml-6 text-gray-700">
            {offer.skills && offer.skills.length > 0 ? (
              offer.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))
            ) : (
              <li>No skills specified</li>
            )}
          </ul>
        </div>
        <div>
          <span className="font-semibold text-cyan-700">Requirements:</span>
          <ul className="list-disc ml-6 text-gray-700">
            {offer.requirements && offer.requirements.length > 0 ? (
              offer.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))
            ) : (
              <li>No requirements specified</li>
            )}
          </ul>
        </div>
        <div>
          <span className="font-semibold text-cyan-700">Description:</span>
          <div className="bg-gray-50 rounded p-3 mt-1 text-gray-800 whitespace-pre-line">
            {offer.description}
          </div>
        </div>
        {offer.file_url && (
          <div>
            <span className="font-semibold text-cyan-700">File:</span>{' '}
            <a
              href={offer.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-700 underline"
            >
              View file
            </a>
          </div>
        )}
      </div>
    </div>
  );
}