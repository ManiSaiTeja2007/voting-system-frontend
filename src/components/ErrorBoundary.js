import React from 'react';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught in boundary:', error, errorInfo);
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="card p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-red-500">{t('error.title')}</h2>
            <p className="text-gray-300 mt-4">{t('error.message')}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary mt-4 p-2 text-white rounded-lg"
            >
              {t('error.retry')}
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ErrorBoundaryWithTranslation(props) {
  const { t } = useTranslation();
  return <ErrorBoundary t={t} {...props} />;
}