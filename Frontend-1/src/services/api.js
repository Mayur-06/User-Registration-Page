/**
 * Centralized API Service for connecting Frontend-1 to the FastAPI Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/,'');

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_URL is not set. Configure VITE_API_URL before building the frontend.'
  );
}

const TOKEN_STORAGE_KEY = 'access_token';

// In-memory / storage token handlers
export const getAccessToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  } catch (e) {
    return null;
  }
};

export const setAccessToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to access localStorage', e);
  }
};

export const clearAccessToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear token', e);
  }
};

/**
 * Base fetch wrapper with automatic Authorization header injection,
 * JSON serialization, and Refresh Token Rotation on 401 Unauthorized.
 */
async function request(endpoint, options = {}, retryOnUnauthorized = true) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...options.headers };

  // Attach JWT Bearer token if present
  const token = getAccessToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData vs JSON
  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Include HttpOnly cookies (for refresh_token)
  };

  try {
    let response = await fetch(url, config);

    // Auto Refresh Token on 401 (if access token expired)
    if (response.status === 401 && retryOnUnauthorized && !endpoint.includes('/login') && !endpoint.includes('/signup') && !endpoint.includes('/refresh')) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${getAccessToken()}`;
        response = await fetch(url, { ...config, headers });
      }
    }

    // Parse Response
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      let errorMessage = 'Request failed';
      if (data && typeof data === 'object') {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Pydantic validation errors
          errorMessage = data.detail.map((err) => `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`).join(', ');
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Attempts to obtain a new access token using the HttpOnly refresh token cookie
 */
async function tryRefreshToken() {
  try {
    const res = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        return true;
      }
    }
  } catch (e) {
    console.warn('Failed to refresh access token:', e);
  }
  clearAccessToken();
  return false;
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

export const api = {
  // Auth & User Profile
  auth: {
    signup: async ({ name, age, occupation, education_qualification, email, password }) => {
      const user = await request('/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          age: parseInt(age, 10),
          occupation: occupation.trim(),
          education_qualification: education_qualification.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      // Automatically log in upon successful sign up
      const loginRes = await api.auth.login({ email, password });
      return { user, ...loginRes };
    },

    login: async ({ email, password }) => {
      const res = await request('/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      if (res.access_token) {
        setAccessToken(res.access_token);
      }

      // Fetch full profile of logged in user
      const user = await api.auth.getMe();
      return { access_token: res.access_token, user };
    },

    refresh: async () => {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return await api.auth.getMe();
      }
      return null;
    },

    logout: async () => {
      try {
        await request('/logout', { method: 'POST' });
      } catch (e) {
        console.warn('Logout error (handled):', e);
      } finally {
        clearAccessToken();
      }
    },

    getMe: async () => {
      return await request('/me', { method: 'GET' });
    },

    updateMe: async ({ name, age, occupation, education_qualification }) => {
      const payload = {};
      if (name !== undefined) payload.name = name.trim();
      if (age !== undefined) payload.age = parseInt(age, 10);
      if (occupation !== undefined) payload.occupation = occupation.trim();
      if (education_qualification !== undefined) payload.education_qualification = education_qualification.trim();

      return await request('/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },

    uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await request('/me/profile-image', {
      method: 'POST',
      body: formData,
    });
  },

    deleteMe: async () => {
      const res = await request('/me', { method: 'DELETE' });
      clearAccessToken();
      return res;
    },
  },

  // Conversations & History
  conversations: {
    list: async () => {
      return await request('/conversations', { method: 'GET' });
    },

    create: async (title = null) => {
      return await request('/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: title || undefined }),
      });
    },

    getMessages: async (conversationId) => {
      return await request(`/conversations/${conversationId}/messages`, { method: 'GET' });
    },

    delete: async (conversationId) => {
      return await request(`/conversations/${conversationId}`, { method: 'DELETE' });
    },
  },

  // RAG Chat
  chat: {
    send: async (question, conversationId) => {
      return await request('/chat', {
        method: 'POST',
        body: JSON.stringify({
          question,
          conversation_id: conversationId,
        }),
      });
    },
  },

  // Document Ingestion & FAISS Vector Index
  documents: {
    upload: async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      return await request('/documents/upload', {
        method: 'POST',
        body: formData,
      });
    },

    list: async () => {
      return await request('/documents', { method: 'GET' });
    },

    delete: async (filename) => {
      return await request(`/documents/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
    },
  },

  // System Health
  health: {
    check: async () => {
      return await request('/health', { method: 'GET' });
    },
  },
  supabase_health: {
    check: async () => {
      return await request('/supabase_health', { method: 'GET' });
    },
  },
};


export default api;
