// app/services/testService.ts

// URL de base de votre API Flask.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- Définition des Interfaces (Types) pour les Tests ---

// Structure d'une question de test telle que reçue par le frontend
// (sans la bonne réponse, pour la sécurité)
export interface TestQuestion {
  question: string;
  options: string[];
}

// Structure d'un test complet récupéré par le frontend
export interface Test {
  _id: string;
  title: string;
  level: string;
  qcm: TestQuestion[];
  offer_id: string;
}

// Structure de la réponse après la soumission du test
export interface TestSubmissionResponse {
  message: string;
  score_percent: number;
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
  return response.json();
}

// --- Définition des Appels API pour les Tests ---

export const testApi = {
  /**
   * Récupère un test par son ID pour qu'un candidat puisse le passer.
   * Fait appel à : GET /api/tests/<id>
   */
  getById: async (testId: string): Promise<Test> => {
    // CORRECTION: L'URL est /tests/<id>, pas /tests/test/<id>
    const response = await fetch(`${API_URL}/tests/${testId}`);
    return handleResponse<Test>(response);
  },

  /**
   * Soumet les réponses d'un candidat pour un test spécifique.
   * Fait appel à : POST /api/tests/<id>/submit
   */
  submit: async (testId: string, answers: { question: string, answer: string }[]): Promise<TestSubmissionResponse> => {
    // CORRECTION: L'URL est /tests/<id>/submit
    const response = await fetch(`${API_URL}/tests/${testId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Le backend attend un objet avec une clé "answers" qui est une liste
      body: JSON.stringify({ answers }),
    });
    return handleResponse<TestSubmissionResponse>(response);
  },

  // NOTE: La fonction 'generate' a été retirée car la génération de test
  // est un processus automatique du backend déclenché par la création d'une offre.
  // Il n'y a pas de route API publique pour la déclencher manuellement.
};