// components/LotteryList.jsx
import React from 'react';
import { formatDate } from '../utils/formatters';

const LotteryList = ({ lotteryResults, listLoading, selectedId, onItemClick, darkMode }) => {
  if (listLoading) {
    return (
      <div style={{
        color: darkMode ? '#BDBDBD' : '#666',
        textAlign: 'center',
        padding: '20px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {lotteryResults.map((lottery) => (
        <div
          key={lottery.unique_id}
          onClick={() => onItemClick(lottery)}
          style={{
            padding: '12px',
            marginBottom: '8px',
            backgroundColor: selectedId === lottery.unique_id 
              ? (darkMode ? '#FF5252' : '#D32F2F') 
              : 'transparent',
            color: selectedId === lottery.unique_id 
              ? 'white' 
              : (darkMode ? '#E0E0E0' : '#333'),
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {lottery.lottery_name}
          </div>
          <div style={{ 
            fontSize: '14px', 
            opacity: 0.8,
            marginTop: '4px'
          }}>
            {formatDate(lottery.date)}
          </div>
          <div style={{ 
            fontSize: '13px', 
            opacity: 0.7,
            marginTop: '2px'
          }}>
            Draw: {lottery.draw_number}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LotteryList;