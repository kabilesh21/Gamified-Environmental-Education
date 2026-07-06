import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Configure default base URL for local Spring Boot backend
axios.defaults.baseURL = 'http://localhost:8080';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session state from LocalStorage on load
  useEffect(() => {
    const savedToken = localStorage.getItem('ecoverse_token');
    const savedUser = localStorage.getItem('ecoverse_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      const userObj = JSON.parse(savedUser);
      setUser(userObj);
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const data = res.data; // JwtResponse
    
    setToken(data.token);
    setUser(data);
    
    localStorage.setItem('ecoverse_token', data.token);
    localStorage.setItem('ecoverse_user', JSON.stringify(data));
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const register = async (signUpData) => {
    const res = await axios.post('/api/auth/signup', signUpData);
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await axios.post('/api/auth/verify-otp', { email, otp });
    return res.data;
  };

  const resendOtp = async (email) => {
    const res = await axios.post(`/api/auth/resend-otp?email=${encodeURIComponent(email)}`);
    return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await axios.post('/api/auth/forgot-password', { email });
    return res.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const res = await axios.post('/api/auth/reset-password', { email, otp, newPassword });
    return res.data;
  };

  const refreshUserData = async () => {
    try {
      const res = await axios.get('/api/profile');
      const freshUser = res.data;
      setUser(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          fullName: freshUser.fullName,
          xp: freshUser.xp,
          level: freshUser.level,
          streak: freshUser.currentStreak,
          coins: freshUser.coins,
          treeXp: freshUser.treeXp,
          treeLevel: freshUser.treeLevel,
        };
        localStorage.setItem('ecoverse_user', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Failed to refresh user stats", e);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ecoverse_token');
    localStorage.removeItem('ecoverse_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      verifyOtp,
      resendOtp,
      forgotPassword,
      resetPassword,
      logout,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}
