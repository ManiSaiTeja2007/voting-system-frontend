import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SignIn = ({ setToken, setRoles, setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [did, setDid] = useState('');
  const [vc, setVc] = useState('');
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setToken(data.token);
        setRoles(data.roles.split(','));
        setView(data.roles.includes('ROLE_ADMIN') ? 'admin' : 'user');
      }
    } catch (err) {
      alert(t('auth.login_failed'));
      console.error('Login failed:', err);
    }
  };

  const handleDIDLogin = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/did-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ did, vc, username }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setToken(data.token);
        setRoles(data.roles.split(','));
        setView(data.roles.includes('ROLE_ADMIN') ? 'admin' : 'user');
      }
    } catch (err) {
      alert(t('auth.did_login_failed'));
      console.error('DID login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate__animated animate__fadeIn">
      <div className="card max-w-lg w-full p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-300">{t('auth.signin')}</h2>
        <input
          type="text"
          placeholder={t('auth.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-600 focus:ring"
          aria-label="Username"
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-600 focus:ring"
          aria-label="Password"
        />
        <button
          onClick={handleLogin}
          className="btn-primary w-full p-3 rounded-xl text-white font-semibold"
          aria-label="Sign In"
        >
          {t('auth.signin')}
        </button>
        <h4 className="text-center my-4 text-gray-300">{t('auth.or_did')}</h4>
        <input
          type="text"
          placeholder={t('auth.did')}
          value={did}
          onChange={(e) => setDid(e.target.value)}
          className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-600 focus:ring"
          aria-label="Decentralized ID"
        />
        <input
          type="text"
          placeholder={t('auth.vc')}
          value={vc}
          onChange={(e) => setVc(e.target.value)}
          className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-600 focus:ring"
          aria-label="Verifiable Credential"
        />
        <button
          onClick={handleDIDLogin}
          className="btn-primary w-full p-3 rounded-xl text-white font-semibold"
          aria-label="Sign In with DID"
        >
          {t('auth.signin_did')}
        </button>
        <p className="mt-6 text-center text-gray-400">
          {t('auth.no_account')}
          <button onClick={() => setView('signup')} className="text-indigo-400 hover:underline ml-1">
            {t('auth.signup')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;