import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const SignIn = lazy(() => import('./SignIn.jsx'));
const SignUp = lazy(() => import('./SignUp.jsx'));
const AdminDashboard = lazy(() => import('./AdminDashboard.jsx'));
const UserDashboard = lazy(() => import('./UserDashboard.jsx'));

const App = () => {
  const [token, setToken] = useState('');
  const [roles, setRoles] = useState([]);
  const [view, setView] = useState('login');
  const [polls, setPolls] = useState([]);
  const [results, setResults] = useState({});
  const [qrCode, setQrCode] = useState('');
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState({});
  const [badges, setBadges] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [analytics, setAnalytics] = useState('');
  const [securityAlert, setSecurityAlert] = useState('');
  const [securityScore, setSecurityScore] = useState(0);
  const [holographicMode, setHolographicMode] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    fetch(`http://localhost:8080/api/messages?lang=${lang}`)
      .then((res) => res.json())
      .then((data) => {
        i18n.addResourceBundle(lang, 'translation', data);
        setMessages(data);
      })
      .catch((err) => console.error('Messages fetch failed:', err));
  }, [lang, i18n]);

  useEffect(() => {
    if (!token) return;
    const endpoints = [
      { url: '/api/polls', setter: setPolls },
      { url: '/api/gamification/badges', setter: setBadges },
      { url: '/api/gamification/leaderboard', setter: setLeaderboard },
      { url: '/api/analytics', setter: (data) => setAnalytics(data.trend) },
      { url: '/api/security-score', setter: (data) => setSecurityScore(data.score) },
    ];
    endpoints.forEach(({ url, setter }) => {
      fetch(`http://localhost:8080${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setter)
        .catch((err) => console.error(`${url} fetch failed:`, err));
    });
  }, [token]);

  useEffect(() => {
    if (!token || !polls.length) return;
    let stompClient;
    try {
      const socket = new SockJS('http://localhost:8080/ws');
      stompClient = Stomp.over(socket);
      stompClient.connect(
        {},
        () => {
          polls.forEach((poll) => {
            stompClient.subscribe(`/topic/results/${poll.id}`, (message) => {
              setResults((prev) => ({
                ...prev,
                [poll.id]: JSON.parse(message.body),
              }));
            });
          });
        },
        (err) => console.error('WebSocket connection failed:', err),
      );
    } catch (err) {
      console.error('WebSocket setup failed:', err);
    }
    return () => stompClient?.disconnect();
  }, [polls, token]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <LanguageSwitcher lang={lang} setLang={setLang} />
        <h1 className="text-5xl font-bold text-center py-8 text-indigo-300 animate-pulse">
          {i18n.t('app.title')}
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          {view === 'login' && <SignIn setToken={setToken} setRoles={setRoles} setView={setView} />}
          {view === 'signup' && <SignUp setView={setView} />}
          {view === 'admin' && (
            <AdminDashboard
              token={token}
              polls={polls}
              setPolls={setPolls}
              results={results}
              qrCode={qrCode}
              setQrCode={setQrCode}
              securityAlert={securityAlert}
              securityScore={securityScore}
              holographicMode={holographicMode}
              setHolographicMode={setHolographicMode}
            />
          )}
          {view === 'user' && (
            <UserDashboard
              token={token}
              polls={polls}
              results={results}
              badges={badges}
              leaderboard={leaderboard}
              analytics={analytics}
              securityAlert={securityAlert}
              securityScore={securityScore}
              holographicMode={holographicMode}
              setHolographicMode={setHolographicMode}
            />
          )}
        </Suspense>
        {token && (
          <button
            onClick={() => {
              setToken('');
              setRoles([]);
              setView('login');
            }}
            className="absolute top-4 left-4 btn-primary bg-red-600 p-2 text-white rounded-lg font-semibold hover:bg-red-700"
            aria-label="Logout"
          >
            {i18n.t('auth.logout')}
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;