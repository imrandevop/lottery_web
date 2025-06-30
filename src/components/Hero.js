import React from 'react';
import { getStyles } from '../styles/styles';

const Hero = ({ onDownloadApp, isDarkMode }) => {
  const styles = getStyles(isDarkMode);

  return (
    <header style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>Kerala Lottery Results</h1>
        <p style={styles.heroSubtitle}>Get the latest lottery results instantly</p>
        <button style={styles.heroDownloadButton} onClick={onDownloadApp}>
          📱 Download Mobile App
        </button>
      </div>
    </header>
  );
};

export default Hero;