# Authentication System

This document describes the authentication system implemented in the frontend.

## Overview

The authentication system uses JWT tokens stored in localStorage and provides a complete login/signup flow with protected routes.

## Components

### 1. API Service (`src/lib/api.ts`)
- Handles all API calls to the backend
- Manages JWT token storage and retrieval
- Provides authentication methods (login, signup, logout)
- Includes error handling with custom `ApiError` class

### 2. Auth Context (`src/contexts/AuthContext.tsx`)
- Manages authentication state throughout the app
- Provides `useAuth` hook for components
- Handles user persistence across page reloads
- Exposes login, signup, and logout methods

### 3. Protected Route (`src/components/auth/ProtectedRoute.tsx`)
- Wraps routes that require authentication
- Redirects unauthenticated users to login page
- Shows loading state while checking authentication
- Preserves intended destination for post-login redirect

## Usage

### Basic Authentication Check
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return isAuthenticated ? (
    <div>Welcome, {user?.name}!</div>
  ) : (
    <div>Please log in</div>
  );
}
```

### Login
```tsx
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // User is now logged in
    } catch (error) {
      // Handle error
    }
  };
}
```

### Protected Routes
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<Route 
  path="/protected" 
  element={
    <ProtectedRoute>
      <ProtectedComponent />
    </ProtectedRoute>
  } 
/>
```

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Backend Integration

The frontend expects the backend to provide these endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

Both endpoints should return:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

## Security Features

- JWT tokens stored in localStorage
- Automatic token inclusion in API requests
- Protected route redirection
- Error handling for authentication failures
- Loading states for better UX

## Error Handling

The system provides comprehensive error handling:
- Network errors
- Authentication failures
- Invalid credentials
- Server errors

All errors are displayed to users via toast notifications. 