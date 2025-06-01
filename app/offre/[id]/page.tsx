"use client";
import { useEffect, useState } from 'react';
import { jobOffersApi } from '@/services/api';
import { useParams } from 'next/navigation';

export default function OffrePage() {
    const params = useParams();
    const id = params?.id;
    const [job, setJob] = useState<any>(null);

    useEffect(() => {
        if (id) {
            jobOffersApi.getById(id.toString()).then(setJob);
        }
    }, [id]);
    console.log('Job data:', job);
    return (
        <div>
            {job ? (
                <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{job.title}</h1>
                    <div style={{ color: "#888", marginBottom: 16 }}>
                        <span>Publié le : {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Type de contrat :</strong> {job.contract_type}
                        <br />
                        <strong>Type de travail :</strong> {job.work_type}
                        <br />
                        <strong>Niveau :</strong> {job.niveau}
                        <br />
                        <strong>Lieu :</strong> {job.location}
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Compétences requises :</strong>
                        <ul>
                            {Array.isArray(job.skills) && job.skills.length > 0 ? (
                                job.skills.map((skill: string, idx: number) => (
                                    <li key={idx}>{skill}</li>
                                ))
                            ) : (
                                <li>Aucune compétence spécifiée</li>
                            )}
                        </ul>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Description :</strong>
                        <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: 12, borderRadius: 4, fontFamily: "inherit" }}>
                            {job.description}
                        </pre>
                    </div>
                </div>
            ) : (
                <div>Chargement...</div>
            )}
        </div>
    );
}