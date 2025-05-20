# Account API Integration Guide

## Overview

This guide explains how to integrate with our Account API endpoints using React and Axios. Our API follows a unique pattern where all requests are made to a single endpoint (`/api/`) using POST requests, differentiated by a schema parameter in the request body.

## API Request Pattern

- **Endpoint**: All requests go to `/api/` using POST method
- **Authentication**: Routes marked with `+API` require authentication; `-API` routes don't
- **Payload Structure**: 
  - All requests require a `schema` parameter
  - Routes with `+schema` require additional `data` payload
  - Routes with `-schema` don't expect additional data

## Account API Endpoints

| Schema | Authentication | Data Required | Function |
|--------|---------------|--------------|----------|
| `account` | Required | No | Fetch user profile |
| `account_create` | Not Required | Yes | Create new account |
| `account_login` | Not Required | Yes | User login |
| `account_logout` | Required | No | User logout |
| `account_reset` | Required | No | Reset account |
| `account_verify` | Required | No | Verify account |
| `account_update` | Required | Yes | Update account |
| `account_password` | Required | Yes | Change password |

## Integration Examples

### Setting up Axios instance

```javascript
// api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-api-domain',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests that need it
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Example Usage

#### Fetching User Profile

```javascript
// Requires authentication (+API)
// No additional data needed (-account)
const getUserProfile = async () => {
  try {
    const response = await api.post('/api/', {
      schema: 'account'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
```

#### Creating a User Account

```javascript
// No authentication required (-API)
// Additional data required (+account_create)
const createUserAccount = async (userData) => {
  try {
    const response = await api.post('/api/', {
      schema: 'account_create',
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        // other required fields
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};
```

#### User Login

```javascript
// No authentication required (-API)
// Additional data required (+account_login)
const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/', {
      schema: 'account_login',
      data: {
        email: credentials.email,
        password: credentials.password
      }
    });
    
    // Store token in localStorage if included in response
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

#### User Logout

```javascript
// Authentication required (+API)
// No additional data required (+account_logout)
const logoutUser = async () => {
  try {
    const response = await api.post('/api/', {
      schema: 'account_logout'
    });
    
    // Clear stored token
    localStorage.removeItem('auth_token');
    
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};
```

#### Updating User Account

```javascript
// Authentication required (+API)
// Additional data required (+account_update)
const updateUserAccount = async (userData) => {
  try {
    const response = await api.post('/api/', {
      schema: 'account_update',
      data: {
        name: userData.name,
        email: userData.email,
        // other fields to update
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};
```

#### Change Password

```javascript
// Authentication required (+API)
// Additional data required (+account_password)
const changePassword = async (passwordData) => {
  try {
    const response = await api.post('/api/', {
      schema: 'account_password',
      data: {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};
```

## Best Practices

1. **Modular Organization**: Create separate modules for each functional area (account, products, etc.)
2. **Error Handling**: Implement consistent error handling across all API calls
3. **Loading States**: Track request status to show appropriate loading indicators
4. **Token Management**: Securely manage authentication tokens
5. **Response Validation**: Validate API responses before using the data

## Common Error Handling

```javascript
const makeApiRequest = async (schema, data = null) => {
  try {
    const payload = { schema };
    if (data) payload.data = data;
    
    const response = await api.post('/api/', payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error(`API Error (${error.response.status}):`, error.response.data);
      
      // Handle specific error codes
      if (error.response.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('auth_token');
        // Redirect to login page
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Error in setting up request
      console.error('Request Error:', error.message);
    }
    throw error;
  }
};
```

This guide should help you understand the API's unique structure and integrate it effectively in a React application using Axios.
But you should keep in mind that this applies to all future backends
