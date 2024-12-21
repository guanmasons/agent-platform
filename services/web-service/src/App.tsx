import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import keycloak, { initializeKeycloak } from './auth/keycloak';
import Dashboard from './components/Dashboard';
import Agents from './components/Agents';
import Profile from './components/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { APP_CLIENT_ID } from './config';

function App() {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    initializeKeycloak()
      .then((authenticated) => {
        setKeycloakInitialized(true);
        if (authenticated) {
          console.log('User is authenticated');
          console.log('Access Token:', keycloak.token);
        } else {
          console.log('User is not authenticated');
          // Redirect to login or initiate login flow
          // keycloak.login(); 
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error);
      });
  }, []);

  if (!keycloakInitialized) {
    return <div>Initializing Keycloak...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            keycloak.authenticated ? (
              <Dashboard />
            ) : (
              <Navigate to={`/login?redirect=${encodeURIComponent('/dashboard')}`} />
            )
          }
        />
        <Route
          path="/agents"
          element={
            keycloak.authenticated ? (
              <Agents />
            ) : (
              <Navigate to={`/login?redirect=${encodeURIComponent('/agents')}`} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            keycloak.authenticated ? (
              <Profile />
            ) : (
              <Navigate to={`/login?redirect=${encodeURIComponent('/profile')}`} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;