import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PowerBIEmbedComponent from './components/PowerBIEmbedComponent';
import './App.css';

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);

  const backendUrl = 'https://movielabs-ai-dashboard-mn.onrender.com';
  const embedId = '9f92cc54-8318-44c4-a671-a020ea14ef56';
  const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=9f92cc54-8318-44c4-a671-a020ea14ef56&groupId=4c6a6199-2d9c-423c-a366-7e72edc983ad';

  const fetchTokens = async () => {
    try {
      const { data: authData } = await axios.post(`${backendUrl}/auth-token`);
      const { data: embedData } = await axios.post(`${backendUrl}/embed-token`, { authToken: authData.access_token });
      setAccessToken(embedData.token);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch tokens', err);
      setError('Failed to load dashboard. Please try again later.');
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordInput === 'movielabs') {
      setShowModal(false);
      setIsLoading(true);
      await fetchTokens();
      const refreshInterval = 40 * 60 * 1000;
      intervalRef.current = setInterval(() => {
        console.log('Refreshing embed token...');
        fetchTokens();
      }, refreshInterval);
    } else {
      alert('Incorrect password. Try again.');
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      {showModal && (
        <div className="modal">
          <form className="modal-content" onSubmit={handlePasswordSubmit}>
            <h2>Enter Password</h2>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
            />
            <div style={{ margin: '1px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <input
    type="checkbox"
    id="showPassword"
    checked={showPassword}
    onChange={(e) => setShowPassword(e.target.checked)}
  />
  <label htmlFor="showPassword" style={{ marginLeft: '8px' }}>Show Password</label>
</div>

            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div>Loading dashboard...</div>
        </div>
      )}

      {error ? (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</div>
      ) : accessToken ? (
        <PowerBIEmbedComponent embedUrl={embedUrl} accessToken={accessToken} embedId={embedId} />
      ) : null}
    </div>
  );
}

export default App;
