// File: lottery-app/src/components/PrizeSection.js
import React from 'react';
import { getStyles } from '../styles/styles';
import { formatCurrency } from '../utils/formatters';

const PrizeSection = ({ prize, isDarkMode }) => {
  const styles = getStyles(isDarkMode);
  
  // Get prize background color (always pure red)
  const getPrizeColor = () => '#FF0000';
  
  const backgroundColor = getPrizeColor();

  return (
    <div style={styles.prizeSection}>
      <div style={{...styles.prizeHeader, backgroundColor}}>
        <h3 style={styles.prizeTitle}>
          {prize.prize_type === '1st' ? '1st Prize' : 
           prize.prize_type === 'consolation' ? 'Consolation Prize' :
           prize.prize_type === '2nd' ? '2nd Prize' :
           prize.prize_type === '3rd' ? '3rd Prize' :
           `${prize.prize_type} Prize`}
        </h3>
      </div>
      
      <div style={styles.prizeContent}>
        <div style={styles.prizeAmount}>
          {formatCurrency(prize.prize_amount)}
          {prize.prize_type === '1st' && (
            <span style={styles.croreText}> [1 Crore]</span>
          )}
        </div>
        
        {prize.tickets && prize.tickets.length > 0 ? (
          <div style={styles.ticketsContainer}>
            {prize.tickets.map((ticket, index) => (
              <div key={index} style={styles.ticketCard}>
                <div style={styles.ticketNumber}>{ticket.ticket_number}</div>
                {ticket.location && (
                  <div style={styles.ticketLocation}>📍 {ticket.location}</div>
                )}
              </div>
            ))}
          </div>
        ) : prize.ticket_numbers ? (
          <div style={styles.consolationGrid}>
            {prize.ticket_numbers.split(' ').map((number, index) => (
              <div key={index} style={styles.consolationTicket}>
                {number}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PrizeSection;