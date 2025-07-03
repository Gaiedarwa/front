const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface TestQuestion {
  question: string;
  options: string[];
  explanation: string;
  keyword: string;
  correct_answer: string;
}

export interface Test {
  _id: string;
  title: string;
  level: string;
  keywords: string[];
  qcm: TestQuestion[];
  generated_by: string;
  offer_id: string;
}

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.message || 'Une erreur est survenue');
  }
  return response.json();
}

export const testApi = {
  getById: async (testId: string): Promise<Test> => {
    const response = await fetch(`${API_URL}/tests/test/${testId}`);
    return handleResponse<Test>(response);
  },

  generate: async (jobOfferId: string): Promise<Test> => {
    const response = await fetch(`${API_URL}/tests/generate-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ job_offer_id: jobOfferId }),
    });
    return handleResponse<Test>(response);
  },

  submit: async (testId: string, answers: Record<string, string>): Promise<{ score: number }> => {
    const response = await fetch(`${API_URL}/tests/${testId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });
    return handleResponse<{ score: number }>(response);
  }
}; 