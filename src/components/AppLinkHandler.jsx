import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const AppLinkHandler = ({ targetPath = '/results' }) => {
  const [showFallback, setShowFallback] = useState(false);
  const [attempting, setAttempting] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const config = {
    appScheme: "app://results",
    playStoreUrl: "https://play.google.com/store/apps/details?id=app.solidapps.lotto",
    fallbackDelay: 2000,
    iosAppStoreUrl: "https://apps.apple.com/app/kerala-lotto/id123456789" // Add iOS support
  };

  const detectDevice = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return {
      isAndroid: /android/.test(userAgent),
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)
    };
  }, []);

  const attemptAppOpen = useCallback(() => {
    const device = detectDevice();

    try {
      if (device.isMobile) {
        // Create hidden iframe for mobile app opening
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.left = '-1000px';
        iframe.src = config.appScheme;

        iframe.onerror = () => {
          console.log('App not installed or failed to open');
          setError('Unable to open app');
        };

        document.body.appendChild(iframe);

        // Clean up iframe after attempt
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 100);
      } else {
        // Desktop fallback - show download options
        setShowFallback(true);
        setAttempting(false);
      }
    } catch (err) {
      console.error('Error attempting to open app:', err);
      setError('Failed to open app');
      setShowFallback(true);
      setAttempting(false);
    }
  }, [config.appScheme, detectDevice]);

  useEffect(() => {
    let resolved = false;
    let visibilityHandler;
    let timeoutId;

    // Detection logic
    const detectApp = () => {
      visibilityHandler = () => {
        if (document.hidden && !resolved) {
          resolved = true;
          // App opened successfully, user switched to app
          console.log('App opened successfully');
        }
      };

      // Listen for visibility changes to detect app opening
      document.addEventListener('visibilitychange', visibilityHandler);

      // Fallback timeout
      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          setAttempting(false);
          setShowFallback(true);
          if (visibilityHandler) {
            document.removeEventListener('visibilitychange', visibilityHandler);
          }
        }
      }, config.fallbackDelay);

      // Attempt to open app
      attemptAppOpen();
    };

    detectApp();

    // Cleanup function
    return () => {
      resolved = true;
      if (visibilityHandler) {
        document.removeEventListener('visibilitychange', visibilityHandler);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [attemptAppOpen, config.fallbackDelay]);

  const handleStoreClick = useCallback(() => {
    const device = detectDevice();

    if (device.isAndroid) {
      window.open(config.playStoreUrl, '_blank');
    } else if (device.isIOS) {
      window.open(config.iosAppStoreUrl, '_blank');
    } else {
      // Desktop - show both options or default to Play Store
      window.open(config.playStoreUrl, '_blank');
    }
  }, [config.playStoreUrl, config.iosAppStoreUrl, detectDevice]);

  const handleRetry = useCallback(() => {
    setShowFallback(false);
    setAttempting(true);
    setError(null);
    attemptAppOpen();
  }, [attemptAppOpen]);

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
    const device = detectDevice();

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
          backdropFilter: 'blur(10px)',
          maxWidth: '400px',
          margin: '0 20px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎰</div>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Kerala Lotto App</h1>

          {error && (
            <p style={{
              color: '#ffeb3b',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {error}
            </p>
          )}

          <p style={{ marginBottom: '20px' }}>
            {device.isMobile
              ? 'App not installed? Download from the store'
              : 'Download our mobile app for the best experience'
            }
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handleStoreClick}
              style={{
                background: 'white',
                color: '#D32F2F',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {device.isIOS ? '🍎 App Store' :
               device.isAndroid ? '📱 Play Store' : '📱 Download'}
            </button>

            {device.isMobile && (
              <button
                onClick={handleRetry}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            )}
          </div>

          <p style={{
            fontSize: '12px',
            marginTop: '20px',
            opacity: '0.8'
          }}>
            Redirecting to {location.pathname}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default AppLinkHandler;