import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // If context is still fetching token, render a static loading view
    return <div style={styles.loading}>Connecting to Ecoversee...</div>;
  }

  if (!user) {
    // Redirect to login if user session is absent
    return <Navigate to="/login" replace />;
  }

  return children;
}

const styles = {
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#8B6B4A',
    backgroundColor: '#F8F5F1',
  }
};
