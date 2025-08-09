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
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge"
import { Edit2, Search, Trash2 } from "lucide-react"
import CandidaturesDashboard from './Candidatures';
import { useRouter } from 'next/navigation';

export default function RHDashboard() {

    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") === "applications" ? "applications" : "offers";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
    const [applications, setApplications] = useState<Postulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/login')
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const offers = await jobOffersApi.getPublicAll();
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
       <div className="min-h-[calc(100vh-120px)] flex w-full" style={{ width: "100%" }}>
            <div className="bg-white rounded-lg shadow p-6 " style={{ width: "100%" }}>
                <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">HR Dashboard</h1>
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
                                Job Offers
                            </button>
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`${activeTab === 'applications'
                                        ? 'border-[rgb(20,77,86)] text-[rgb(20,77,86)]'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Applications
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === 'offers' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {/* Optionally add a subtitle here */}
                            </h2>
                            <Link
                                href="/dashboard/offer/create"
                                className="btn-primary"
                            >
                                Create Offer
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
                                            <span className="font-medium">Level:</span> {offer.level}
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
                                            <span className="font-medium">Contract Type:</span> {offer.contract_type}
                                        </p>
                                        <p className="text-gray-600 mb-4">
                                            <span className="font-medium">Location:</span> {offer.location}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between items-center mt-auto" style={{ marginTop: "auto" }}>
                                        <span className="text-sm text-gray-500"></span>
                                        <div className="space-x-2 flex">
                                            <Link
                                                href={`/offer/create/${offer._id}`}
                                                className="p-2 rounded hover:bg-gray-100 text-[rgb(20,77,86)]"
                                                title="Edit"
                                            >
                                                <Edit2 width={20} height={20} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteOffer(offer._id)}
                                                className="p-2 rounded hover:bg-red-100 text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 width={20} height={20} />
                                            </button>
                                            <Link
                                                href={`/offre/${offer._id}`}
                                                className="p-2 rounded hover:bg-blue-100 text-blue-600 flex items-center gap-1"
                                                title="Details"
                                            >
                                                <Search width={20} height={20} />
                                                <span className="sr-only md:not-sr-only">Details</span>
                                            </Link>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'applications' && (
                    <CandidaturesDashboard />
                )}
            </div>
        </div>
    );
} 