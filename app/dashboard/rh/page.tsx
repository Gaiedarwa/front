'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link';
import { jobOffersApi, applicationsApi, JobOffer, Postulation } from '@/services/api';
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Edit2, Search, Trash2 } from "lucide-react"

export default function RHDashboard() {

    const [activeTab, setActiveTab] = useState('offers');
    const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
    const [applications, setApplications] = useState<Postulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const offers = await jobOffersApi.getAll();
                setJobOffers(offers);
                console.log(offers);

                const apps = await applicationsApi.getAll();
                setApplications(apps);

                setError(null);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleDeleteOffer = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
            try {
                await jobOffersApi.delete(id);
                setJobOffers(offers => offers.filter(offer => offer._id !== id));
            } catch (err) {
                setError('Erreur lors de la suppression de l\'offre');
                console.error(err);
            }
        }
    };


    return (
        <div className="min-h-screen bg-white">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[rgb(20,77,86)]">
                        Dashboard RH
                    </h1>
                </div>

                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('offers')}
                                className={`${activeTab === 'offers'
                                        ? 'border-[rgb(20,77,86)] text-[rgb(20,77,86)]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Offres d'emploi
                            </button>
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`${activeTab === 'applications'
                                        ? 'border-[rgb(20,77,86)] text-[rgb(20,77,86)]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Candidatures
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === 'offers' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Liste des offres d'emploi
                            </h2>
                            <Link
                                href="/offre/create"
                                className="btn-primary"
                            >
                                Créer une offre
                            </Link>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                            {jobOffers.map(offer => (
                                <Card key={offer._id} className="shahd-card">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold mb-2">
                                            {offer.title}
                                        </CardTitle>
                                        <CardDescription>
                                            <span className="font-medium">Niveau:</span> {offer.level}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {offer.skills && offer.skills.slice(0, 4).map((skill: string) => (
                                                <Badge key={skill}>{skill}</Badge>
                                            ))}
                                            {offer.skills && offer.skills.length > 4 && (
                                                <Badge key="more">+{offer.skills.length - 4}</Badge>
                                            )}
                                        </div>
                                        <p className="text-gray-600 mb-2">
                                            <span className="font-medium">Type de contrat:</span> {offer.contract_type}
                                        </p>
                                        <p className="text-gray-600 mb-4">
                                            <span className="font-medium">Lieu:</span> {offer.location}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center mt-auto" style={{ marginTop: "auto" }}>
                                        <span className="text-sm text-gray-500"></span>
                                        <div className="space-x-2 flex">
                                            <Link
                                                href={`/rh/offers/edit/${offer._id}`}
                                                className="p-2 rounded hover:bg-gray-100 text-[rgb(20,77,86)]"
                                                title="Modifier"
                                            >
                                                <Edit2 width={20} height={20} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteOffer(offer._id)}
                                                className="p-2 rounded hover:bg-red-100 text-red-600"
                                                title="Supprimer"
                                            >
                                                <Trash2 width={20} height={20} />
                                            </button>
                                            <button
                                                
                                                className="p-2 rounded hover:bg-red-100 text-red-600"
                                                title="details"
                                            >
                                                <Link href={`/offre/${offer._id}`}>
                                                    <Search width={20} height={20} />
                                                </Link>
                                            </button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

            
            </main>
        </div>
    );
} 