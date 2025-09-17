import React, { useEffect, useState } from 'react';

const AppLinkHandler = ({ targetPath = '/results' }) => {
  const [showFallback, setShowFallback] = useState(false);
  const [attempting, setAttempting] = useState(true);

  useEffect(() => {
    const config = {
      appScheme: "app://results",
      playStoreUrl: "https://play.google.com/store/apps/details?id=app.solidapps.lotto",
      fallbackDelay: 2000
    };

    let resolved = false;

    // Try to open app
    const attemptAppOpen = () => {
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());

      if (isMobile) {
        // Create hidden iframe for mobile
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = config.appScheme;

        iframe.onerror = () => {
          console.log('App not installed');
        };

        document.body.appendChild(iframe);

        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 100);
      }
    };

    // Detection logic
    const detectApp = () => {
      const visibilityHandler = () => {
        if (document.hidden && !resolved) {
          resolved = true;
          // App opened, stay on loading
        }
      };

      document.addEventListener('visibilitychange', visibilityHandler);

      // Fallback timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          setAttempting(false);
          setShowFallback(true);
          document.removeEventListener('visibilitychange', visibilityHandler);
        }
      }, config.fallbackDelay);

      // Attempt to open app
      attemptAppOpen();
    };

    detectApp();

    return () => {
      resolved = true;
    };
  }, []);

  const handlePlayStoreClick = () => {
    window.open('https://play.google.com/store/apps/details?id=app.solidapps.lotto', '_blank');
  };

  if (attempting && !showFallback) {
    return (
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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎰</div>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Kerala Lotto App</h1>
          <div style={{
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTop: '3px solid white',
            width: '30px',
            height: '30px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
          <p>Opening app...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (showFallback) {
    return (
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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎰</div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Kerala Lotto App</h1>
          <p style={{ marginBottom: '20px' }}>App not installed? Download from Play Store</p>
          <button
            onClick={handlePlayStoreClick}
            style={{
              background: 'white',
              color: '#D32F2F',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📱 Download App
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AppLinkHandler;