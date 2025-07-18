import { config } from '@/config/env';

const API_BASE_URL = config.api.baseUrl;

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('Making API request to:', fullUrl);
  console.log('Request options:', { method: options.method, headers, body: options.body });

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    console.error('API Error:', errorData);
    throw new ApiError(response.status, errorData.message || 'Request failed');
  }

  const data = await response.json();
  console.log('API Response:', data);
  return data;
};

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await makeRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(response.token);
    return response;
  },

  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await makeRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: (): void => {
    removeAuthToken();
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeCurrentUser: (): void => {
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};

export async function fetchQuestions(params: Record<string, any> = {}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/questions/all?${query}`);
  if (!res.ok) throw new Error('Failed to fetch questions');
  return res.json();
}

// If/when the backend adds a tags endpoint, use this:
export async function fetchTags() {
  const res = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/tags/all`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function postQuestion(data: { title: string; description: string; tags: string[] }) {
  return makeRequest<{ message: string; question: any; tags: string[] }>(
    '/questions/',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

export async function getQuestionById(id: string) {
  return makeRequest<{
    question: {
      id: string;
      title: string;
      description: string;
      user: { id: string; username: string };
      tags: string[];
      createdAt: string;
      updatedAt: string;
      resolved: boolean;
      upvotes: number;
      downvotes: number;
    };
    answers: Array<{
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      user: { id: string; username: string };
      voteCount: number;
    }>;
  }>(`/questions/get/${id}`);
}

export async function voteQuestion(questionId: string, value: 1 | -1) {
  return makeRequest<{ message: string; upvotes: number; downvotes: number }>(
    `/questions/${questionId}/vote`,
    {
      method: 'POST',
      body: JSON.stringify({ value }),
    }
  );
}

export async function postAnswer(questionId: string, content: string) {
  return makeRequest<{ message: string; answer: any }>(
    `/answers/${questionId}`,
    {
      method: 'POST',
      body: JSON.stringify({ content }),
    }
  );
}

export async function voteAnswer(answerId: string, value: 1 | -1) {
  return makeRequest<{ message: string; voteCount: number }>(
    `/answers/vote/${answerId}`,
    {
      method: 'POST',
      body: JSON.stringify({ value }),
    }
  );
}

export async function acceptAnswer(answerId: string) {
  return makeRequest<{ message: string }>(
    `/answers/accept/${answerId}`,
    {
      method: 'POST',
    }
  );
}

export { ApiError, getAuthToken, setAuthToken, removeAuthToken }; 