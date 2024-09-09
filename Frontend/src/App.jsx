import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DocumentUpload from './DocumentUpload';
import NLPQuery from './NLPQuery';
import Login from './Login';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  useEffect(() => {
    if (authToken) {
      // Optionally, verify the token with the backend on app load
    }
  }, [authToken]);

  const isAuthenticated = !!authToken;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/upload" /> : <Login setAuthToken={setAuthToken} />}
        />
        <Route
          path="/upload"
          element={isAuthenticated ? <DocumentUpload /> : <Navigate to="/login" />}
        />
        <Route
          path="/query"
          element={isAuthenticated ? <NLPQuery /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;

