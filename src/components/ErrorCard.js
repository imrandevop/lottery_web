import React from 'react';
import { getStyles } from '../styles/styles';

const ErrorCard = ({ isDarkMode, error, onRetry }) => {
  const styles = getStyles(isDarkMode);

  return (
    <div style={styles.errorCard}>
      <p style={styles.errorText}>{error}</p>
      {onRetry && (
        <button style={styles.retryButton} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorCard;