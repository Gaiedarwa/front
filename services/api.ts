// app/services/api.ts

// URL de base de votre API Flask.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- Définition des Interfaces (Types) ---

// Structure d'une offre d'emploi, telle qu'elle existe dans votre backend
export interface JobOffer {
  _id: string;
  title: string;
  company: string;
  location: string;
  work_type: string;
  contract_type: string;
  level: string;
  description: string;
  skills: string[];
  requirements: string[];
  test_id?: string;
  test_generation_status: 'pending' | 'completed' | 'failed' | 'no_skills_found';
}

// Structure d'une candidature, telle qu'elle existe dans votre backend
export interface Postulation {
  _id: string;
  type: 'targeted' | 'open';
  candidate: {
    name: string;
    email: string;
    phone: string;
  };
  cv_analysis: {
    skills: string[];
    summary: string;
  };
  job_offer_id?: string;
  match_details?: {
    overall_score: number;
    matched_skills: string[];
  };
  match_results?: {
      offer_id: string;
      offer_title: string;
      score: number;
  }[];
  is_matched?: boolean;
  status: string;
  test_id?: string;
  test_results?: {
    score_percent: number;
  };
}

// --- Fonctions Utilitaires pour la Gestion des Appels API ---

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
  // Gère le cas des réponses vides (ex: DELETE)
  if (response.headers.get('Content-Length') === '0' || status === 204) {
    return Promise.resolve({} as T);
  }
  return response.json();
}

// --- Définition des Appels API pour les Offres d'Emploi ---

export const jobOffersApi = {
  // NOTE: Votre code backend ne contient pas les routes pour les offres.
  // Voici à quoi elles ressembleraient. Vous devrez les implémenter dans Flask.
  
  /**
   * Crée et analyse une nouvelle offre d'emploi à partir d'un fichier.
   * Fait appel à : POST /api/job_offers
   */
  create: async (offerFile: File): Promise<JobOffer> => {
    const formData = new FormData();
    formData.append('file', offerFile);
    
    // CORRECTION: La route RESTful standard pour créer est POST sur la ressource
    const response = await fetch(`${API_URL}/offers/create`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<JobOffer>(response);
  },

  /**
   * Récupère toutes les offres d'emploi.
   * Fait appel à : GET /api/job_offers
   */
  getAll: async (): Promise<JobOffer[]> => {
    const response = await fetch(`${API_URL}/offers/`);
    return handleResponse<JobOffer[]>(response);
  },
  getById: async (id: string): Promise<JobOffer> => {
    const response = await fetch(`${API_URL}/offers/${id}`);
    return handleResponse<JobOffer>(response);
  },
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/offers/${id}`, {
      method: 'DELETE',
    });
  },
};

// --- Définition des Appels API pour les Candidatures ---

export const applicationsApi = {
  /**
   * Soumet un CV pour une offre spécifique (candidature ciblée).
   * Fait appel à : POST /api/postulations/apply
   */
  applyToOffer: async (cvFile: File, offerId: string): Promise<Postulation> => {
    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('offer_id', offerId);
    
    // CORRECTION: Renommage de la fonction pour être plus explicite
    const response = await fetch(`${API_URL}/postulations/apply`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<Postulation>(response);
  },
  
  /**
   * Soumet un CV sans cibler d'offre (candidature spontanée).
   * Fait appel à : POST /api/postulations/apply-open
   */
  applyOpen: async (cvFile: File): Promise<Postulation> => {
    const formData = new FormData();
    formData.append('cv', cvFile);

    const response = await fetch(`${API_URL}/postulations/apply-open`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<Postulation>(response);
  },

  /**
   * Récupère toutes les candidatures.
   * Fait appel à : GET /api/postulations
   */
  getAll: async (): Promise<Postulation[]> => {
    const response = await fetch(`${API_URL}/postulations`);
    return handleResponse<Postulation[]>(response);
  },

  /**
   * Récupère une candidature par son ID.
   * Fait appel à : GET /api/postulations/<id>
   */
  getById: async (id: string): Promise<Postulation> => {
    const response = await fetch(`${API_URL}/postulations/${id}`);
    return handleResponse<Postulation>(response);
  },

  /**
   * Supprime une candidature par son ID.
   * Fait appel à : DELETE /api/postulations/<id>
   */
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_URL}/postulations/${id}`, {
      method: 'DELETE',
    });
  },
};