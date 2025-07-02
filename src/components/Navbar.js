// File: lottery-app/src/components/Navbar.js
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

  // Navigation action handlers
  const handleNavigation = (sectionId) => {
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // If section doesn't exist, scroll to top
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  const handleRecentDraws = () => {
    // Close mobile menu
    setIsMobileMenuOpen(false);
    
    // Scroll to the sidebar/draws section
    const sidebar = document.querySelector('[data-section="sidebar"]') || 
                   document.querySelector('.sidebar') ||
                   document.getElementById('draws');
    
    if (sidebar) {
      sidebar.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // Fallback: scroll to main content
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.logo}>
          <h1 
            style={styles.logoText}
            onClick={() => handleNavigation('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigation('home')}
          >
            LOTTO
          </h1>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuButton}
          onClick={handleMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
        
        {/* Desktop Navigation */}
        <div style={styles.navLinks}>
          <button 
            style={styles.navLink}
            onClick={() => handleNavigation('home')}
          >
            Home
          </button>
          <button 
            style={styles.navLink}
            onClick={handleRecentDraws}
          >
            Recent Draws
          </button>
          <button 
            style={styles.navLink}
            onClick={() => handleNavigation('results')}
          >
            Results
          </button>
          <button 
            style={styles.navLink}
            onClick={() => handleNavigation('about')}
          >
            About
          </button>
          <button 
            style={styles.navLink}
            onClick={() => handleNavigation('contact')}
          >
            Contact
          </button>
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
            <button 
              style={styles.mobileNavLink}
              onClick={() => handleNavigation('home')}
            >
              Home
            </button>
            <button 
              style={styles.mobileNavLink}
              onClick={handleRecentDraws}
            >
              📊 Recent Draws
            </button>
            <button 
              style={styles.mobileNavLink}
              onClick={() => handleNavigation('results')}
            >
              Results
            </button>
            <button 
              style={styles.mobileNavLink}
              onClick={() => handleNavigation('about')}
            >
              About
            </button>
            <button 
              style={styles.mobileNavLink}
              onClick={() => handleNavigation('contact')}
            >
              Contact
            </button>
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