import React from 'react';
import { getStyles } from '../styles/styles';
import { formatShortDate, formatCurrency } from '../utils/formatters';
import LoadingCard from './LoadingCard';
import ErrorCard from './ErrorCard';

const Sidebar = ({ 
  lotteryDraws, 
  selectedDraw, 
  loading, 
  error, 
  onDrawClick, 
  isDarkMode 
}) => {
  const styles = getStyles(isDarkMode);

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <h2 style={styles.sidebarTitle}>Recent Draws</h2>
      </div>
      
      {loading ? (
        <LoadingCard isDarkMode={isDarkMode} text="Loading draws..." />
      ) : error ? (
        <ErrorCard isDarkMode={isDarkMode} error={error} />
      ) : (
        <div style={styles.drawsList}>
          {lotteryDraws.map((draw) => (
            <article
              key={draw.unique_id}
              style={{
                ...styles.drawCard,
                ...(selectedDraw?.unique_id === draw.unique_id ? styles.selectedDrawCard : {})
              }}
              onClick={() => onDrawClick(draw)}
            >
              <div style={styles.drawCardHeader}>
                <time style={styles.drawDate}>{formatShortDate(draw.date)}</time>
                <span style={styles.drawNumber}>#{draw.draw_number}</span>
              </div>
              <h3 style={styles.drawName}>{draw.lottery_name}</h3>
              <div style={styles.drawPrize}>
                First Prize: {formatCurrency(draw.first_prize.amount)}
              </div>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;