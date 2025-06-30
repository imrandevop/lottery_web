import React from 'react';
import { getStyles } from '../styles/styles';

const LoadingCard = ({ isDarkMode, text = "Loading..." }) => {
  const styles = getStyles(isDarkMode);

  return (
    <div style={styles.loadingCard}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>{text}</p>
    </div>
  );
};

export default LoadingCard;