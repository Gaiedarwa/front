const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface JobOffer {
  _id: string;
  title: string;
  company: string;
  location: string;
  workType: string;
  contractType: string;
  level: string;
  description: string;
  niveau: string;
  skills: string[];
  requirements: string[];
  created_at: string;
}

export interface Application {
  _id: string;
  candidate: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    matched_skills: string[];
    resume: string;
  };
  job_offer: {
    id: string;
    title: string;
    skills: string[];
    level: string;
  };
  similarity_score: number;
  matched: boolean;
  created_at: string;
}

export interface Test {
  title: string;
  niveau: string;
  qcm: {
    question: string;
    keyword: string;
    options: string[];
    correct_answer: string;
  }[];
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

export const jobOffersApi = {
  getAll: async (): Promise<JobOffer[]> => {
    const response = await fetch(`${API_URL}/job-offers`);
    return handleResponse<JobOffer[]>(response);
  },

  getById: async (id: string): Promise<JobOffer> => {
    const response = await fetch(`${API_URL}/job-offers/${id}`);
    return handleResponse<JobOffer>(response);
  },

  create: async (data: Omit<JobOffer, '_id' | 'created_at'>): Promise<JobOffer> => {
    const response = await fetch(`${API_URL}/job-offers/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<JobOffer>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/job-offers/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  apply: async (formData: FormData): Promise<Application> => {
    const response = await fetch(`${API_URL}/postulations/apply`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<Application>(response);
  },
};

export const applicationsApi = {
  getAll: async (): Promise<Application[]> => {
    const response = await fetch(`${API_URL}/postulations`);
    return handleResponse<Application[]>(response);
  },

  getById: async (id: string): Promise<Application> => {
    const response = await fetch(`${API_URL}/postulations/${id}`);
    return handleResponse<Application>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/postulations/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const testsApi = {
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
  },
}; 