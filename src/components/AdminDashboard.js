import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { initHolographicCanvas } from '../utils/holographic.js';

const AdminDashboard = ({
  token,
  polls,
  setPolls,
  results,
  qrCode,
  setQrCode,
  securityAlert,
  securityScore,
  holographicMode,
  setHolographicMode,
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [expiresAt, setExpiresAt] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (holographicMode) {
      import('three').then(() => initHolographicCanvas(polls)).catch((err) => console.error('Three.js load failed:', err));
    }
  }, [holographicMode, polls]);

  const addOption = () => setOptions([...options, '']);
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = async () => {
    try {
      const pollData = {
        question,
        options: options.reduce((acc, opt) => ({ ...acc, [opt]: 0 }), {}),
        expiresAt,
      };
      const res = await fetch('http://localhost:8080/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pollData),
      });
      const data = await res.json();
      setPolls([...polls, data]);
      alert(t('poll.created'));
    } catch (err) {
      alert(t('poll.create_failed'));
      console.error('Poll creation failed:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/polls/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPolls(polls.filter((poll) => poll.id !== id));
    } catch (err) {
      alert(t('poll.delete_failed'));
      console.error('Poll deletion failed:', err);
    }
  };

  const handleQR = async (pollId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/votes/qr/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.text();
      setQrCode(data);
    } catch (err) {
      alert(t('poll.qr_failed'));
      console.error('QR generation failed:', err);
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4 animate__animated animate__fadeInUp">
      {securityAlert && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-6 animate__animated animate__shakeX">
          {securityAlert}
        </div>
      )}
      <div className="mb-6 text-center">
        <p className="text-gray-300">
          {t('security.score')}: {(securityScore * 100).toFixed(2)}%
        </p>
        <p className="text-indigo-300">{t('quantum.enabled')}</p>
      </div>
      <button
        onClick={() => setHolographicMode(!holographicMode)}
        className="btn-primary w-full p-3 mb-6 text-white rounded-lg font-semibold"
        aria-label="Toggle Holographic Mode"
      >
        {holographicMode ? t('holographic.disable') : t('holographic.enable')}
      </button>
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-300">{t('admin.create_poll')}</h2>
      <div className="card p-8 rounded-xl mb-10 grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder={t('poll.question')}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="p-3 bg-gray-700 text-white border border-gray-600 focus:ring"
          aria-label="Poll Question"
        />
        {options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`${t('poll.option')} ${index + 1}`}
            value={opt}
            onChange={(e) => updateOption(index, e.target.value)}
            className="p-3 bg-gray-700 text-white border border-gray-600 focus:ring"
            aria-label={`Option ${index + 1}`}
          />
        ))}
        <button
          onClick={addOption}
          className="btn-primary p-3 text-white rounded-lg font-semibold"
          aria-label="Add Option"
        >
          {t('poll.add_option')}
        </button>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="p-3 bg-gray-700 text-white border border-gray-600 focus:ring"
          aria-label="Expiration Date"
        />
        <button
          onClick={handleCreate}
          className="btn-primary p-3 text-white rounded-lg font-semibold"
          aria-label="Create Poll"
        >
          {t('poll.create')}
        </button>
      </div>
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-300">{t('admin.polls')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <div key={poll.id} className="card p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-indigo-200">{poll.question}</h3>
            <p className="text-gray-400">
              {t('poll.status')}: {poll.active ? t('poll.active') : t('poll.closed')}
            </p>
            <p className="text-gray-400">
              {t('poll.expires')}: {new Date(poll.expiresAt).toLocaleString()}
            </p>
            <div className="mt-4">
              <h4 className="font-semibold text-indigo-300">{t('poll.results')}:</h4>
              <ul className="text-gray-300">
                {results[poll.id] &&
                  Object.entries(results[poll.id]).map(([opt, count]) => (
                    <li key={opt}>
                      {opt}: {count}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleDelete(poll.id)}
                className="btn-primary bg-red-600 p-2 text-white rounded-lg hover:bg-red-700"
                aria-label="Delete Poll"
              >
                {t('poll.delete')}
              </button>
              <button
                onClick={() => handleQR(poll.id)}
                className="btn-primary p-2 text-white rounded-lg"
                aria-label="Generate QR Code"
              >
                {t('poll.generate_qr')}
              </button>
            </div>
          </div>
        ))}
      </div>
      {qrCode && (
        <div className="mt-10 card p-8 rounded-xl text-center">
          <h4 className="text-xl font-semibold text-indigo-300">{t('poll.qr_code')}</h4>
          <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="mx-auto mt-4 w-48 h-48" />
        </div>
      )}
      <div className="mt-10 card p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-300">{t('analytics.trend')}</h2>
        <p className="text-gray-300">{analytics}</p>
        <p className="text-indigo-300">{t('analytics.federated')}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;