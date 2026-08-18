import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getAccessToken, clearAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const token = getAccessToken();

      try {
        if (token) {
          // Verify & fetch current user
          const currentUser = await api.auth.getMe();
          setUser(currentUser);
        } else {
          // Attempt refresh using HttpOnly cookie if access token isn't in localStorage
          const refreshedUser = await api.auth.refresh();
          if (refreshedUser) {
            setUser(refreshedUser);
          }
        }
      } catch (err) {
        console.warn('Session restoration failed or expired:', err);
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login handler
  const login = async ({ email, password }) => {
    setAuthError(null);
    try {
      const res = await api.auth.login({ email, password });
      setUser(res.user);
      return res.user;
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      throw err;
    }
  };

  // Signup handler
  const signup = async (signupData) => {
    setAuthError(null);
    try {
      const res = await api.auth.signup(signupData);
      setUser(res.user);
      return res.user;
    } catch (err) {
      const msg = err.message || 'Sign up failed. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (err) {
      console.warn('Error during logout:', err);
    } finally {
      setUser(null);
      setAuthError(null);
    }
  };

  // Profile update handler
  const updateProfile = async (updateData) => {
    try {
      const updatedUser = await api.auth.updateMe(updateData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  // Delete account handler
  const deleteAccount = async () => {
    try {
      await api.auth.deleteMe();
      setUser(null);
    } catch (err) {
      throw err;
    }
  };

  // Direct state updater
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await api.auth.getMe();
      setUser(currentUser);
    } catch (err) {
      console.warn('Failed to refresh user profile:', err);
    }
  }, []);

  const value = {
    user,
    setUser,
    loading,
    authError,
    setAuthError,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    deleteAccount,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
