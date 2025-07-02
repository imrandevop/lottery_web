
// -// File: lottery-app/src/components/Navbar.js
import React from 'react';
import { getStyles } from '../styles/styles';

const Navbar = ({ 
  isDarkMode, 
  toggleTheme, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  onDownloadApp 
}) => {
  const styles = getStyles(isDarkMode);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>LOTTO</h1>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
        
        {/* Desktop Navigation */}
        <div style={styles.navLinks}>
          <a href="#home" style={styles.navLink}>Home</a>
          <a href="#results" style={styles.navLink}>Results</a>
          <a href="#about" style={styles.navLink}>About</a>
          <a href="#contact" style={styles.navLink}>Contact</a>
          <button style={styles.downloadButton} onClick={onDownloadApp}>
            📱 Download App
          </button>
          
          {/* Theme Toggle Button */}
          <button 
            style={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div style={styles.mobileNavMenu}>
            <a href="#home" style={styles.mobileNavLink}>Home</a>
            <a href="#results" style={styles.mobileNavLink}>Results</a>
            <a href="#about" style={styles.mobileNavLink}>About</a>
            <a href="#contact" style={styles.mobileNavLink}>Contact</a>
            <button style={styles.mobileDownloadButton} onClick={onDownloadApp}>
              📱 Download App
            </button>
            
            {/* Theme Toggle in Mobile Menu */}
            <button 
              style={styles.mobileThemeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;