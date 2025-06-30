import React from 'react';
import { getStyles } from '../styles/styles';

const Footer = ({ onDownloadApp, isDarkMode }) => {
  const styles = getStyles(isDarkMode);

  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>LOTTO</h3>
          <p style={styles.footerText}>
            Your trusted source for Kerala lottery results. Get instant updates on winning numbers, prize amounts, and ticket details.
          </p>
          <button style={styles.footerDownloadButton} onClick={onDownloadApp}>
            📱 Download Mobile App
          </button>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Quick Links</h4>
          <a href="#home" style={styles.footerLink}>Home</a>
          <a href="#results" style={styles.footerLink}>Latest Results</a>
          <a href="#about" style={styles.footerLink}>About Us</a>
          <a href="#winners" style={styles.footerLink}>Recent Winners</a>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Lottery Types</h4>
          <a href="#karunya" style={styles.footerLink}>Karunya</a>
          <a href="#winwin" style={styles.footerLink}>Win-Win</a>
          <a href="#sthreesakthi" style={styles.footerLink}>Sthree Sakthi</a>
          <a href="#bhagyathara" style={styles.footerLink}>Bhagyathara</a>
        </div>
        
        <div style={styles.footerSection}>
          <h4 style={styles.footerSubtitle}>Support</h4>
          <a href="#contact" style={styles.footerLink}>Contact Us</a>
          <a href="#help" style={styles.footerLink}>Help Center</a>
          <a href="#faq" style={styles.footerLink}>FAQ</a>
          <a href="#terms" style={styles.footerLink}>Terms & Conditions</a>
        </div>
      </div>
      
      <div style={styles.footerBottom}>
        <p style={styles.copyright}>
          © 2025 LOTTO. All rights reserved. | Kerala State Lottery Results
        </p>
      </div>
    </footer>
  );
};

export default Footer;