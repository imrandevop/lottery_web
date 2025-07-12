// components/Header.jsx
import React from 'react';

const Header = ({ darkMode, setDarkMode, isMobile, mobileMenuOpen, onMenuToggle }) => {
  return (
    <header style={{
      backgroundColor: darkMode ? '#121212' : '#FFF1F2',
      padding: '16px 20px',
      borderBottom: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <button
              onClick={onMenuToggle}
              style={{
                background: 'none',
                border: 'none',
                color: darkMode ? '#E0E0E0' : '#333',
                fontSize: '24px',
                marginRight: '16px',
                cursor: 'pointer'
              }}
            >
              ☰
            </button>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{
              color: darkMode ? '#FF5252' : '#D32F2F',
              margin: '0',
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 'bold'
            }}>
              LOTTO
            </h1>
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.3s ease'
          }}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header;