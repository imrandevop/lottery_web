import React from 'react';
import { getStyles } from '../styles/styles';

const WelcomeCard = ({ onDownloadApp, isDarkMode }) => {
  const styles = getStyles(isDarkMode);

  return (
    <div style={styles.welcomeCard}>
      <div style={styles.welcomeIcon}>🎰</div>
      <h2 style={styles.welcomeTitle}>Welcome to LOTTO</h2>
      <p style={styles.welcomeText}>
        Select a lottery draw from the sidebar to view detailed results
      </p>
      <button style={styles.welcomeDownloadButton} onClick={onDownloadApp}>
        📱 Get Mobile App
      </button>
    </div>
  );
};

export default WelcomeCard;