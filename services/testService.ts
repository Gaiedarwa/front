// app/services/testService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface TestQuestion {
  question: string;
  choices: string[]; // <-- Correction ici
}

export interface Test {
  _id: string;
  title: string;
  level: string;
  qcm: TestQuestion[];
  offer_id: string;
}

export interface TestSubmissionResponse {
  message: string;
  score_percent: number;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const status = response.status;
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new ApiError(errorData.error || `Request failed with status ${status}`, status);
  }
  return response.json();
}

export const testApi = {
  getById: async (testId: string, candidateId: string): Promise<Test> => {
    const response = await fetch(`${API_URL}/tests/${testId}/${candidateId}`);
    return handleResponse<Test>(response);
  },

  submit: async (
    testId: string,
    answers: { question: string, answer: string }[],
    candidateId: string
  ): Promise<TestSubmissionResponse> => {
    const response = await fetch(`${API_URL}/tests/${testId}/${candidateId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    return handleResponse<TestSubmissionResponse>(response);
  },
};