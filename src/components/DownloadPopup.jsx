// components/DownloadPopup.jsx
import React from 'react';

const DownloadPopup = ({ show, onClose, darkMode }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: darkMode ? '#1E1E1E' : 'white',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '300px',
        margin: '20px'
      }}>
        <h3 style={{
          color: darkMode ? '#FF5252' : '#D32F2F',
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          Get Our App!
        </h3>
        <p style={{
          color: darkMode ? '#E0E0E0' : '#333',
          margin: '0 0 20px 0',
          fontSize: '16px'
        }}>
          Download our app for faster results and notifications
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => {/* Add download logic here */}}
            style={{
              backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Download App
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              color: darkMode ? '#BDBDBD' : '#666',
              border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPopup;