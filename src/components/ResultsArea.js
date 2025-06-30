import React from 'react';
import { getStyles } from '../styles/styles';
import { formatShortDate } from '../utils/formatters';
import PrizeSection from './PrizeSection';
import LoadingCard from './LoadingCard';
import ErrorCard from './ErrorCard';
import WelcomeCard from './WelcomeCard';

const ResultsArea = ({ 
  selectedDraw, 
  selectedResults, 
  resultsLoading, 
  error, 
  onDownloadApp, 
  isDarkMode 
}) => {
  const styles = getStyles(isDarkMode);

  return (
    <section style={styles.resultsArea}>
      {selectedDraw ? (
        <div style={styles.resultsContainer}>
          {/* Results Header */}
          <header style={styles.resultsHeader}>
            <h2 style={styles.resultsTitle}>{selectedDraw.lottery_name}</h2>
            <div style={styles.resultsInfo}>
              <time style={styles.resultsDate}>📅 {formatShortDate(selectedDraw.date)}</time>
              <span style={styles.resultsDrawNumber}>#{selectedDraw.draw_number}</span>
            </div>
          </header>
          
          {resultsLoading ? (
            <LoadingCard isDarkMode={isDarkMode} text="Loading detailed results..." />
          ) : error ? (
            <ErrorCard isDarkMode={isDarkMode} error={error} />
          ) : selectedResults ? (
            <div style={styles.prizesContainer}>
              {selectedResults.prizes.map((prize) => (
                <PrizeSection 
                  key={prize.prize_type} 
                  prize={prize} 
                  isDarkMode={isDarkMode} 
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <WelcomeCard onDownloadApp={onDownloadApp} isDarkMode={isDarkMode} />
      )}
    </section>
  );
};

export default ResultsArea;