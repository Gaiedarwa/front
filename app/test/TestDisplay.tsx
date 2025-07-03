"use client"

import React, { useEffect, useState } from 'react';
import { Test, testApi, TestQuestion } from '@/services/testService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TestDisplayProps {
  testId: string;
}

export function TestDisplay({ testId }: TestDisplayProps) {
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const data = await testApi.getById(testId);
        setTest(data);
      } catch (err) {
        setError('Erreur lors du chargement du test');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    if (!test) return;
    const score = calculateScore(test, selectedAnswers);
    setScore(score);
  };

  function calculateScore(test: Test, answers: { [key: number]: string }) {
    let correct = 0;
    test.qcm.forEach((question: TestQuestion, idx: number) => {
      // On compare la réponse utilisateur à la bonne réponse
      if (answers[idx] && question.correct_answer && answers[idx] === question.correct_answer) {
        correct++;
      }
    });
    // Score en pourcentage
    return Math.round((correct / test.qcm.length) * 100);
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!test) return <div>Aucun test trouvé</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{test.title}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{test.level}</Badge>
            {test.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline">{keyword}</Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {test.qcm.map((question, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Question {index + 1}: {question.question}
              </h3>
              <RadioGroup
                value={selectedAnswers[index]}
                onValueChange={(value: string) => handleAnswerSelect(index, value)}
                className="space-y-2"
              >
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                    <Label htmlFor={`q${index}-o${optionIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        {score !== null ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Votre score</h2>
            <p className="text-4xl font-bold text-primary">{score}%</p>
          </div>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== test.qcm.length}
          >
            Soumettre le test
          </Button>
        )}
      </div>

      {score !== null && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">Votre score : {score} %</h2>
        </div>
      )}
    </div>
  );
} 