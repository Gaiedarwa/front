"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { testApi, Test } from "@/services/testService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPage() {
  const params = useParams();
  const testId = params?.testId as string;
  const candidateId = params?.candidateId as string;

  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<{ [idx: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (!testId || !candidateId) return;
  setLoading(true);
  testApi.getById(testId, candidateId)
    .then(setTest)
    .catch(() => setError("Erreur lors du chargement du test"))
    .finally(() => setLoading(false));
}, [testId, candidateId]);

  const handleChange = (qIdx: number, value: string) => {
    setAnswers({ ...answers, [qIdx]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const formattedAnswers = test!.qcm.map((q, idx) => ({
        question: q.question,
        answer: answers[idx] || "",
      }));
      const res = await testApi.submit(testId, formattedAnswers, candidateId);
      setScore(res.score_percent);
    } catch {
      setError("Erreur lors de la soumission du test");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!test) return <div>Test introuvable.</div>;

  if (score !== null) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Votre score : <b>{score}%</b></p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{test.title} <span className="text-sm text-gray-500">({test.level})</span></CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {test.qcm.map((q, idx) => (
              <div key={idx} className="mb-4">
                <div className="font-semibold mb-2">{q.question}</div>
                {q.choices.map((choice, cidx) => (
                  <label key={cidx} className="block">
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={choice}
                      checked={answers[idx] === choice}
                      onChange={() => handleChange(idx, choice)}
                      required
                    />{" "}
                    {choice}
                  </label>
                ))}
              </div>
            ))}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Soumission..." : "Soumettre"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}