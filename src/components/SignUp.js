import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SignUp = ({ setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation();

  const handleSignup = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirmPassword }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        setView('login');
      }
    } catch (err) {
      alert(t('auth.signup_failed'));
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate__animated animate__fadeIn">
      <div className="card max-w-lg w-full p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-300">{t('auth.signup')}</h2>
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
        <input
          type="password"
          placeholder={t('auth.confirm_password')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-3 bg-gray-700 text-white border border-gray-600 focus:ring"
          aria-label="Confirm Password"
        />
        <button
          onClick={handleSignup}
          className="btn-primary w-full p-3 rounded-xl text-white font-semibold"
          aria-label="Sign Up"
        >
          {t('auth.signup')}
        </button>
        <p className="mt-6 text-center text-gray-400">
          {t('auth.have_account')}
          <button onClick={() => setView('login')} className="text-indigo-400 hover:underline ml-1">
            {t('auth.signin')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;