// utils/printUtils.js - FLUTTER STYLE HTML PRINT REPLICA
import { formatDate, formatCurrency, getPrizeLabel } from './formatters';

export const createPrintContent = (resultData, darkMode = false) => {
  const printStyles = generateFlutterStylePrintStyles();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resultData.lottery_name} - ${formatDate(resultData.date)}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
      ${printStyles}
    </head>
    <body>
      <div class="page-container">
        ${createFlutterStyleWatermark()}
        ${createFlutterStyleBorder()}
        <div class="content-wrapper">
          ${createFlutterStyleHeader(resultData)}
          ${createFlutterStyleContent(resultData)}
          ${createFlutterStyleFooter()}
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateFlutterStylePrintStyles = () => {
  return `
    <style>
      @media print {
        @page { 
          size: A4; 
          margin: 0; 
        }
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body {
          font-family: 'Noto Sans', Arial, sans-serif;
          font-size: 12px;
          line-height: 1.2;
          color: black;
          background: white;
          width: 210mm;
          height: 297mm;
          position: relative;
        }
        
        .page-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 120px;
          font-weight: bold;
          color: rgba(200, 200, 200, 0.3);
          z-index: 1;
          pointer-events: none;
          font-family: 'Noto Sans', Arial, sans-serif;
        }
        
        .page-border {
          position: absolute;
          top: 15mm;
          left: 15mm;
          right: 15mm;
          bottom: 15mm;
          border: 1.5px solid black;
          z-index: 2;
        }
        
        .content-wrapper {
          position: relative;
          z-index: 3;
          padding: 20mm;
          height: 100%;
        }
        
        .header {
          text-align: center;
          margin-bottom: 8mm;
          font-weight: bold;
        }
        
        .header-main {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 6px;
        }
        
        .header-details {
          font-size: 12px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }
        
        .header-divider {
          border-bottom: 1px solid #666;
          margin: 8px 0;
        }
        
        .prize-section {
          margin-bottom: 8px;
          font-weight: bold;
        }
        
        .first-prize {
          font-size: 13px;
          margin-bottom: 8px;
        }
        
        .consolation-prize {
          font-size: 13px;
          margin-bottom: 8px;
        }
        
        .second-third-container {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .second-prize, .third-prize {
          flex: 1;
          font-size: 13px;
          border: 1px solid #666;
          padding: 8px;
        }
        
        .lower-tier-prize {
          margin-bottom: 8px;
        }
        
        .lower-tier-header {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 6px;
        }
        
        .number-grid {
          display: grid;
          grid-template-columns: repeat(15, 1fr);
          gap: 0;
          border: 1px solid #666;
        }
        
        .number-cell {
          border: 0.3px solid #666;
          text-align: center;
          padding: 3px 2px;
          font-size: 11px;
          font-weight: bold;
          min-height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer {
          position: absolute;
          bottom: 20mm;
          left: 20mm;
          right: 20mm;
          text-align: center;
          font-size: 10px;
          font-weight: bold;
          color: #666;
          border-top: 1px solid #999;
          padding-top: 8px;
        }
        
        .clickable-area {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10;
          cursor: pointer;
        }
        
        /* Hide clickable area text */
        .clickable-area a {
          display: block;
          width: 100%;
          height: 100%;
          text-decoration: none;
          color: transparent;
        }
      }
    </style>
  `;
};

const createFlutterStyleWatermark = () => {
  return `<div class="watermark">LOTTO</div>`;
};

const createFlutterStyleBorder = () => {
  return `<div class="page-border"></div>`;
};

const createFlutterStyleHeader = (resultData) => {
  const lotteryName = (resultData.lottery_name || 'SUVARNA KERALAM').toUpperCase();
  const drawNumber = resultData.draw_number || 'SK-11';
  const dateStr = formatDate(resultData.date);
  
  return `
    <div class="header">
      <div class="header-main">KERALA LOTTERIES - RESULT BY LOTTO</div>
      <div class="header-details">
        <span>${lotteryName} NO: ${drawNumber}</span>
        <span>Date: ${dateStr}</span>
      </div>
      <div class="header-divider"></div>
    </div>
  `;
};

const createFlutterStyleContent = (resultData) => {
  if (!resultData.prizes) return '';
  
  const sortedPrizes = sortPrizesFlutterStyle(resultData.prizes);
  let html = '';
  
  // 1st Prize
  const firstPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === '1st');
  if (firstPrize) {
    html += createFirstPrizeFlutterStyle(firstPrize);
  }
  
  // Consolation Prize
  const consolationPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === 'consolation');
  if (consolationPrize) {
    html += createConsolationPrizeFlutterStyle(consolationPrize);
  }
  
  // 2nd and 3rd Prizes side by side
  const secondPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === '2nd');
  const thirdPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === '3rd');
  if (secondPrize || thirdPrize) {
    html += createSecondThirdPrizesFlutterStyle(secondPrize, thirdPrize);
  }
  
  // Lower tier prizes
  const lowerTierPrizes = sortedPrizes.filter(p => 
    !['1st', '2nd', '3rd', 'consolation'].includes(p.prize_type.toLowerCase())
  );
  
  lowerTierPrizes.forEach(prize => {
    html += createLowerTierPrizeFlutterStyle(prize);
  });
  
  return html;
};

const createFirstPrizeFlutterStyle = (prize) => {
  const ticketNumbers = getTicketNumbers(prize);
  if (ticketNumbers.length === 0) return '';
  
  const ticketInfo = getTicketWithLocation(prize, ticketNumbers[0]);
  const prizeAmountText = formatCurrency(prize.prize_amount);
  
  return `
    <div class="prize-section first-prize">
      1st Prize Rs: ₹${prizeAmountText}/- [1 Crore]/-: ${ticketNumbers[0]} (${ticketInfo.location})
    </div>
  `;
};

const createConsolationPrizeFlutterStyle = (prize) => {
  const seriesNumbers = getConsolationSeries(prize);
  if (seriesNumbers.length === 0) return '';
  
  const prizeAmountText = formatCurrency(prize.prize_amount);
  const seriesText = seriesNumbers.join(' ');
  
  return `
    <div class="prize-section consolation-prize">
      Consolation Prize Rs: ₹${prizeAmountText}/-/-: ${seriesText}
    </div>
  `;
};

const createSecondThirdPrizesFlutterStyle = (secondPrize, thirdPrize) => {
  let html = '<div class="second-third-container">';
  
  if (secondPrize) {
    const ticketNumbers = getTicketNumbers(secondPrize);
    if (ticketNumbers.length > 0) {
      const ticketInfo = getTicketWithLocation(secondPrize, ticketNumbers[0]);
      const prizeAmountText = formatCurrency(secondPrize.prize_amount);
      
      html += `
        <div class="second-prize">
          <div>2nd Prize Rs: ₹${prizeAmountText}/- [30 Lakhs]/-</div>
          <div style="margin-top: 6px;">${ticketNumbers[0]} (${ticketInfo.location})</div>
        </div>
      `;
    }
  }
  
  if (thirdPrize) {
    const ticketNumbers = getTicketNumbers(thirdPrize);
    if (ticketNumbers.length > 0) {
      const ticketInfo = getTicketWithLocation(thirdPrize, ticketNumbers[0]);
      const prizeAmountText = formatCurrency(thirdPrize.prize_amount);
      
      html += `
        <div class="third-prize">
          <div>3rd Prize Rs: ₹${prizeAmountText}/- [5 Lakhs]/-</div>
          <div style="margin-top: 6px;">${ticketNumbers[0]} (${ticketInfo.location})</div>
        </div>
      `;
    }
  }
  
  html += '</div>';
  return html;
};

const createLowerTierPrizeFlutterStyle = (prize) => {
  const ticketNumbers = getTicketNumbers(prize);
  if (ticketNumbers.length === 0) return '';
  
  const prizeLabel = getPrizeLabel(prize.prize_type);
  const prizeAmountText = formatCurrency(prize.prize_amount);
  
  // Create 15-column grid
  let gridHtml = '<div class="number-grid">';
  
  // Fill grid with numbers
  for (let i = 0; i < ticketNumbers.length; i++) {
    gridHtml += `<div class="number-cell">${ticketNumbers[i]}</div>`;
  }
  
  // Fill remaining cells to complete the last row
  const remainder = ticketNumbers.length % 15;
  if (remainder !== 0) {
    for (let i = remainder; i < 15; i++) {
      gridHtml += '<div class="number-cell"></div>';
    }
  }
  
  gridHtml += '</div>';
  
  return `
    <div class="prize-section lower-tier-prize">
      <div class="lower-tier-header">${prizeLabel} – Rs: ₹${prizeAmountText}/-/-</div>
      ${gridHtml}
    </div>
  `;
};

const createFlutterStyleFooter = () => {
  return `
    <div class="footer">
      The prize winners are advised to verify the winning numbers with the results published in the Kerala Government Gazette and surrender the winning tickets within 90 days.
    </div>
    <div class="clickable-area">
      <a href="https://www.lottokeralalotteries.com" target="_blank">&nbsp;</a>
    </div>
  `;
};

// Helper functions (same as PDF generator)
const getTicketNumbers = (prize) => {
  if (prize.tickets) {
    return prize.tickets.map(t => t.ticket_number);
  }
  if (prize.ticket_numbers) {
    return prize.ticket_numbers.split(/\s+/).filter(n => n.trim());
  }
  return [];
};

const getTicketWithLocation = (prize, ticketNumber) => {
  if (prize.tickets) {
    const ticket = prize.tickets.find(t => t.ticket_number === ticketNumber);
    return {
      number: ticketNumber,
      location: ticket?.location?.toUpperCase() || 'N/A'
    };
  }
  return {
    number: ticketNumber,
    location: 'N/A'
  };
};

const getConsolationSeries = (prize) => {
  const ticketNumbers = getTicketNumbers(prize);
  // Extract series (first 2 characters) from ticket numbers
  const series = [...new Set(ticketNumbers.map(num => num.substring(0, 2)))];
  return series.sort();
};

const sortPrizesFlutterStyle = (prizes) => {
  const order = ['1st', 'consolation', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
  
  return prizes.sort((a, b) => {
    const aIndex = order.indexOf(a.prize_type.toLowerCase());
    const bIndex = order.indexOf(b.prize_type.toLowerCase());
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });
};