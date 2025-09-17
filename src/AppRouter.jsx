import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useSearchParams, Navigate } from 'react-router-dom';
import KeralaLotteryApp from './App';
import AppLinkHandler from './components/AppLinkHandler';

// Component to handle deep link routes similar to Flutter implementation
const DeepLinkHandler = () => {
  const { path } = useParams();
  const [searchParams] = useSearchParams();

  // Handle different deep link paths
  switch (path) {
    case 'results':
      return <KeralaLotteryApp />;
    case 'lottery':
      const uniqueId = searchParams.get('id');
      if (uniqueId) {
        // Pass uniqueId to the main app for lottery details
        return <KeralaLotteryApp lotteryId={uniqueId} />;
      }
      return <KeralaLotteryApp />;
    case 'download':
      // Redirect to Play Store if app is not installed
      return <AppLinkHandler />;
    default:
      return <KeralaLotteryApp />;
  }
};

// Error/404 component
const NotFoundPage = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #FF5252, #D32F2F)',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{
      textAlign: 'center',
      padding: '30px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Page Not Found
      </h1>
      <p style={{ marginBottom: '24px' }}>
        The page you were looking for does not exist.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          background: 'white',
          color: '#D32F2F',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Go to Home
      </button>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Main app route */}
        <Route path="/" element={<KeralaLotteryApp />} />

        {/* Deep link routes for App Links */}
        <Route path="/app/:path" element={<DeepLinkHandler />} />

        {/* Fallback route for any unmatched deep links */}
        <Route path="/deeplink/:path" element={<DeepLinkHandler />} />

        {/* Legacy app link handler */}
        <Route path="/app/results" element={<AppLinkHandler />} />

        {/* 404 page for unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;