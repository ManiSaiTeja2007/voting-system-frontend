import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { initHolographicCanvas } from '../utils/holographic.js';

const UserDashboard = ({
  token,
  polls,
  results,
  badges,
  leaderboard,
  analytics,
  securityAlert,
  securityScore,
  holographicMode,
  setHolographicMode,
}) => {
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [arMode, setArMode] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (holographicMode) {
      import('three').then(() => initHolographicCanvas(polls)).catch((err) => console.error('Three.js load failed:', err));
    }
  }, [holographicMode, polls]);

  const handleVote = async () => {
    if (!selectedPoll || !selectedOption) {
      alert(t('vote.select_option'));
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pollId: selectedPoll.id, selectedOption }),
      });
      if (res.ok) {
        alert(t('vote.success'));
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert(t('vote.failed'));
      console.error('Vote submission failed:', err);
    }
  };

  const handleARScan = async () => {
    setArMode(true);
    try {
      await import('aframe');
      setTimeout(async () => {
        try {
          const res = await fetch('http://localhost:8080/api/votes/offline', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ voteToken: '1:user1:1623071234567', selectedOption: 'Red' }),
          });
          alert(res.ok ? t('vote.success') : t('vote.failed'));
        } catch (err) {
          alert(t('vote.offline_failed'));
          console.error('Offline vote failed:', err);
        }
        setArMode(false);
      }, 3000);
    } catch (err) {
      alert(t('vote.ar_failed'));
      console.error('A-Frame load failed:', err);
      setArMode(false);
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
      <h2 className="text-4xl font-bold mb-8 text-center text-indigo-300">{t('user.active_polls')}</h2>
      {arMode ? (
        <div className="ar-overlay w-full h-96 rounded-xl flex items-center justify-center text-white">
          <a-scene embedded arjs="sourceType: webcam;">
            <a-marker preset="hiro">
              <a-box position="0 0.5 0" material="color: blue;"></a-box>
            </a-marker>
            <a-entity camera></a-entity>
          </a-scene>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls
              .filter((poll) => poll.active)
              .map((poll) => (
                <div key={poll.id} className="card p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-indigo-200">{poll.question}</h3>
                  <p className="text-gray-400">
                    {t('poll.expires')}: {new Date(poll.expiresAt).toLocaleString()}
                  </p>
                  <div className="mt-4">
                    <h4 className="font-semibold text-indigo-300">{t('poll.options')}:</h4>
                    {Object.keys(poll.options).map((option) => (
                      <label key={option} className="block text-gray-300">
                        <input
                          type="radio"
                          name={`poll-${poll.id}`}
                          value={option}
                          onChange={(e) => {
                            setSelectedPoll(poll);
                            setSelectedOption(e.target.value);
                          }}
                          className="mr-2 text-indigo-500 focus:ring-indigo-500"
                          aria-label={option}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={handleVote}
                    className="btn-primary mt-4 p-2 text-white rounded-lg font-semibold"
                    aria-label="Submit Vote"
                  >
                    {t('vote.submit')}
                  </button>
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
                </div>
              ))}
          </div>
          <button
            onClick={handleARScan}
            className="btn-primary w-full mt-6 p-3 text-white rounded-lg font-semibold"
            aria-label="Scan QR with AR"
          >
            {t('vote.scan_qr')}
          </button>
        </>
      )}
      <div className="mt-10 card p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-300">{t('user.badges')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(badges).map(([badge, count]) => (
            <div key={badge} className="badge p-2 rounded-lg text-center">
              {t(`gamification.badge_${badge.toLowerCase()}`)}: {count}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 card p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-300">{t('user.leaderboard')}</h2>
        <ul className="text-gray-300">
          {leaderboard.map((entry) => (
            <li key={entry.username} className="py-2 border-b border-gray-600">
              {entry.username}: {entry.points} {t('user.points')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;