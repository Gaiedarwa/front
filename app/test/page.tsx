"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { testApi } from '@/services/testService';

export default function TestPage() {
  const router = useRouter();
  const [jobOfferId, setJobOfferId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const test = await testApi.generate(jobOfferId);
      router.push(`/test/${test._id}`);
    } catch (err) {
      setError('Erreur lors de la génération du test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Générer un test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobOfferId">ID de l'offre d'emploi</Label>
              <Input
                id="jobOfferId"
                value={jobOfferId}
                onChange={(e) => setJobOfferId(e.target.value)}
                placeholder="Entrez l'ID de l'offre d'emploi"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button 
              onClick={handleGenerateTest} 
              disabled={!jobOfferId || loading}
              className="w-full"
            >
              {loading ? 'Génération...' : 'Générer le test'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 