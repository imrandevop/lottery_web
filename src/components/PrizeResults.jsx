// components/PrizeResults.jsx
import React from 'react';
import { formatDate, formatCurrency } from '../utils/formatters';

const PrizeResults = ({ 
  selectedLottery, 
  resultData, 
  loading, 
  error, 
  darkMode, 
  isMobile, 
  onRetry, 
  onPrint 
}) => {
  if (!selectedLottery) {
    return (
      <div style={{
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <h2 style={{
          color: darkMode ? '#E0E0E0' : '#666',
          fontSize: '24px',
          marginBottom: '16px'
        }}>
          Select a Lottery
        </h2>
        <p style={{
          color: darkMode ? '#BDBDBD' : '#888',
          fontSize: '16px'
        }}>
          {isMobile ? 'Tap the menu button to select a lottery' : 'Choose a lottery from the sidebar to view results'}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <div style={{
          color: darkMode ? '#FF5252' : '#D32F2F',
          fontSize: '18px'
        }}>
          Loading result...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        color: '#f44336',
        fontSize: '16px'
      }}>
        {error}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={onRetry}
            style={{
              backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resultData) return null;

  return (
    <div>
      {/* Result Header */}
      <div style={{
        backgroundColor: darkMode ? '#1E1E1E' : 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <h1 style={{
          color: darkMode ? '#FF5252' : '#D32F2F',
          fontSize: isMobile ? '24px' : '28px',
          margin: '0 0 8px 0',
          fontWeight: 'bold'
        }}>
          {resultData.lottery_name}
        </h1>
        
        <div style={{
          color: darkMode ? '#BDBDBD' : '#666',
          fontSize: '16px',
          marginBottom: '4px'
        }}>
          Draw Number: {resultData.draw_number}
        </div>
        <div style={{
          color: darkMode ? '#BDBDBD' : '#666',
          fontSize: '16px',
          marginBottom: '16px'
        }}>
          Date: {formatDate(resultData.date)}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '8px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onPrint}
            style={{
              backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flex: isMobile ? '1' : 'none',
              justifyContent: 'center'
            }}
          >
            🖨️ Print
          </button>
          
          <button
            onClick={() => {/* Add download logic here */}}
            style={{
              backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flex: isMobile ? '1' : 'none',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Download App
          </button>
        </div>

        {resultData.is_bumper && (
          <div style={{
            backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}>
            BUMPER
          </div>
        )}
      </div>

      {/* Prize Results */}
      <PrizeList prizes={resultData.prizes} darkMode={darkMode} isMobile={isMobile} />
    </div>
  );
};

const PrizeList = ({ prizes, darkMode, isMobile }) => {
  if (!prizes) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      {prizes.map((prize, index) => (
        <PrizeItem 
          key={index} 
          prize={prize} 
          darkMode={darkMode} 
          isMobile={isMobile} 
        />
      ))}
    </div>
  );
};

const PrizeItem = ({ prize, darkMode, isMobile }) => {
  const getPrizeLabel = (prizeType) => {
    if (!prizeType) return 'Prize';
    
    const type = prizeType.toLowerCase();
    if (type.includes('1st') || type === '1st') return '1st Prize';
    if (type.includes('2nd') || type === '2nd') return '2nd Prize';
    if (type.includes('3rd') || type === '3rd') return '3rd Prize';
    if (type.includes('consolation') || type.includes('സമാധാനം')) return 'Consolation Prize';
    if (type.includes('4th')) return '4th Prize';
    if (type.includes('5th')) return '5th Prize';
    if (type.includes('6th')) return '6th Prize';
    if (type.includes('7th')) return '7th Prize';
    if (type.includes('8th')) return '8th Prize';
    return `${prizeType} Prize`;
  };

  return (
    <div style={{
      backgroundColor: darkMode ? '#1E1E1E' : 'white',
      borderRadius: '12px',
      marginBottom: '16px',
      overflow: 'hidden'
    }}>
      {/* Prize Header */}
      <div style={{
        backgroundColor: '#FF5252',
        color: 'white',
        padding: '12px 16px',
        textAlign: 'center'
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {getPrizeLabel(prize.prize_type)}
        </h3>
      </div>

      {/* Prize Amount */}
      <div style={{
        backgroundColor: darkMode ? '#2A2A2A' : '#F5F5F5',
        padding: '12px 16px',
        textAlign: 'center',
        borderBottom: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
      }}>
        <span style={{
          color: darkMode ? '#E0E0E0' : '#333',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          ₹{formatCurrency(prize.prize_amount)}/-
        </span>
      </div>
      
      {/* Ticket Numbers */}
      <div style={{ padding: '16px' }}>
        <TicketNumbers 
          prize={prize} 
          darkMode={darkMode} 
          isMobile={isMobile} 
        />
      </div>
    </div>
  );
};

const TicketNumbers = ({ prize, darkMode, isMobile }) => {
  if (prize.tickets) {
    return (
      <div>
        {prize.tickets.map((ticket, ticketIndex) => (
          <div key={ticketIndex} style={{ 
            marginBottom: '12px',
            padding: '16px',
            backgroundColor: darkMode ? '#2A2A2A' : '#F8F8F8',
            borderRadius: '8px',
            border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
            textAlign: 'center'
          }}>
            <div style={{
              color: darkMode ? '#E0E0E0' : '#333',
              fontSize: isMobile ? '24px' : '20px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}>
              {ticket.ticket_number}
            </div>
            {ticket.location && (
              <div style={{
                color: darkMode ? '#BDBDBD' : '#666',
                fontSize: '14px'
              }}>
                📍 {ticket.location}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  const ticketNumbers = prize.ticket_numbers.split(' ');
  const hasMultipleTickets = ticketNumbers.length > 1;
  
  if (hasMultipleTickets) {
    const isSmallPrize = prize.prize_type && (
      prize.prize_type.includes('4th') || 
      prize.prize_type.includes('5th') || 
      prize.prize_type.includes('6th') || 
      prize.prize_type.includes('7th') || 
      prize.prize_type.includes('8th') || 
      prize.prize_type.includes('9th') || 
      prize.prize_type.includes('10th')
    ) && !prize.prize_type.includes('consolation');
    
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: isSmallPrize ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
        gap: '12px'
      }}>
        {ticketNumbers.map((ticket, ticketIndex) => (
          <div
            key={ticketIndex}
            style={{
              backgroundColor: darkMode ? '#2A2A2A' : '#F8F8F8',
              color: darkMode ? '#E0E0E0' : '#333',
              padding: isSmallPrize ? '12px 8px' : '16px 12px',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: isSmallPrize ? (isMobile ? '18px' : '16px') : (isMobile ? '20px' : '18px'),
              fontFamily: 'monospace',
              fontWeight: 'bold',
              border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
              minHeight: isSmallPrize ? '40px' : '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {ticket}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: darkMode ? '#2A2A2A' : '#F8F8F8',
      padding: '20px',
      borderRadius: '8px',
      color: darkMode ? '#E0E0E0' : '#333',
      fontSize: isMobile ? '24px' : '20px',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
    }}>
      {prize.ticket_numbers}
    </div>
  );
};

export default PrizeResults;