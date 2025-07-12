export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  },
  app: {
    name: 'StackIt',
    version: '1.0.0',
  },
} as const; 