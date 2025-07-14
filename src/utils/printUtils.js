// utils/printUtils.js - EXACT TARGET FORMAT REPLICA
import { formatDate, formatCurrency, getPrizeLabel } from './formatters';
import { MALAYALAM_FOOTER_TEXT } from './constants';

export const createPrintContent = (resultData, darkMode = false) => {
  const printStyles = generateTargetFormatStyles();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resultData.lottery_name} - ${formatDate(resultData.date)}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${printStyles}
    </head>
    <body>
      <div class="container">
        ${createTargetHeader(resultData)}
        ${createTargetContent(resultData)}
        ${createTargetFooter()}
      </div>
    </body>
    </html>
  `;
};

const generateTargetFormatStyles = () => {
  return `
    <style>
      @media print {
        @page { 
          size: A4; 
          margin: 4mm; 
        }
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 7px;
          line-height: 1.0;
          color: black;
          background: white;
        }
        
        .container {
          width: 100%;
          border: 2px solid black;
          background: white;
          height: 289mm;
        }
        
        .header {
          border-bottom: 2px solid black;
          padding: 2mm;
          background: white;
          height: 8mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: bold;
          font-size: 10px;
        }
        
        .header-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }
        
        .content {
          padding: 0;
        }
        
        .prize-row {
          border-bottom: 1px solid black;
          background: white;
          min-height: 6mm;
          display: flex;
          flex-direction: column;
        }
        
        .prize-header-row {
          background: #f8f8f8;
          padding: 1mm 2mm;
          font-weight: bold;
          font-size: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 4mm;
          border-bottom: 1px solid black;
        }
        
        .prize-content-row {
          padding: 1mm;
          background: white;
        }
        
        .first-prize-content {
          text-align: center;
          padding: 2mm;
        }
        
        .first-number {
          font-size: 18px;
          font-weight: bold;
          border: 2px solid black;
          padding: 2mm 4mm;
          margin: 1mm auto;
          display: inline-block;
          background: white;
        }
        
        .location {
          font-size: 7px;
          margin-top: 1mm;
          font-weight: bold;
        }
        
        .consolation-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 0.2mm;
          margin: 0;
          padding: 0.5mm;
        }
        
        .consolation-cell {
          border: 0.5px solid black;
          text-align: center;
          padding: 0.8mm;
          font-weight: bold;
          font-size: 6px;
          background: white;
          height: 3.5mm;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .single-prize-content {
          text-align: center;
          padding: 2mm;
        }
        
        .single-number {
          font-size: 14px;
          font-weight: bold;
          border: 2px solid black;
          padding: 2mm 3mm;
          margin: 1mm auto;
          display: inline-block;
          background: white;
        }
        
        .multi-prize-grid {
          display: grid;
          gap: 0.1mm;
          margin: 0;
          padding: 0.5mm;
        }
        
        .grid-15 { 
          grid-template-columns: repeat(15, 1fr); 
        }
        .grid-6 { 
          grid-template-columns: repeat(6, 1fr); 
        }
        .grid-20 { 
          grid-template-columns: repeat(20, 1fr); 
        }
        .grid-25 { 
          grid-template-columns: repeat(25, 1fr); 
        }
        
        .number-cell {
          border: 0.3px solid black;
          text-align: center;
          padding: 0.5mm 0.2mm;
          font-weight: bold;
          font-size: 5px;
          background: white;
          height: 3mm;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer {
          position: absolute;
          bottom: 2mm;
          left: 2mm;
          right: 2mm;
          font-size: 5px;
          text-align: justify;
          color: #333;
          line-height: 1.1;
          font-weight: normal;
        }
      }
    </style>
  `;
};

const createTargetHeader = (resultData) => {
  return `
    <div class="header">
      <div>${resultData.draw_number || 'SK-11'}</div>
      <div class="header-center">${resultData.lottery_name || 'SUVARNA KERALAM'}</div>
      <div>${formatDate(resultData.date)}</div>
    </div>
  `;
};

const createTargetContent = (resultData) => {
  if (!resultData.prizes) return '';
  
  const sortedPrizes = sortPrizesByType(resultData.prizes);
  let html = '<div class="content">';
  
  sortedPrizes.forEach((prize) => {
    const ticketNumbers = getTicketNumbers(prize);
    const prizeType = prize.prize_type.toLowerCase();
    
    if (prizeType === '1st') {
      html += createTargetFirstPrize(prize, ticketNumbers[0]);
    } else if (prizeType === 'consolation') {
      html += createTargetConsolationPrize(prize, ticketNumbers);
    } else if (['2nd', '3rd'].includes(prizeType)) {
      html += createTargetSinglePrize(prize, ticketNumbers[0]);
    } else {
      html += createTargetMultiPrize(prize, ticketNumbers);
    }
  });
  
  html += '</div>';
  return html;
};

const createTargetFirstPrize = (prize, ticketNumber) => {
  return `
    <div class="prize-row">
      <div class="prize-header-row">
        <span>1st Prize</span>
        <span>₹${formatCurrency(prize.prize_amount)}/-</span>
      </div>
      <div class="prize-content-row">
        <div class="first-prize-content">
          <div class="first-number">${ticketNumber}</div>
          ${prize.tickets && prize.tickets[0] && prize.tickets[0].location ? 
            `<div class="location">(${prize.tickets[0].location.toUpperCase()})</div>` : ''}
        </div>
      </div>
    </div>
  `;
};

const createTargetConsolationPrize = (prize, ticketNumbers) => {
  return `
    <div class="prize-row">
      <div class="prize-header-row">
        <span>Consolation Prize</span>
        <span>₹${formatCurrency(prize.prize_amount)}/-</span>
      </div>
      <div class="prize-content-row">
        <div class="consolation-grid">
          ${ticketNumbers.map(num => `<div class="consolation-cell">${num}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
};

const createTargetSinglePrize = (prize, ticketNumber) => {
  const prizeLabel = prize.prize_type === '2nd' ? '2nd Prize' : '3rd Prize';
  
  return `
    <div class="prize-row">
      <div class="prize-header-row">
        <span>${prizeLabel}</span>
        <span>₹${formatCurrency(prize.prize_amount)}/-</span>
      </div>
      <div class="prize-content-row">
        <div class="single-prize-content">
          <div class="single-number">${ticketNumber}</div>
          ${prize.tickets && prize.tickets[0] && prize.tickets[0].location ? 
            `<div class="location">(${prize.tickets[0].location.toUpperCase()})</div>` : ''}
        </div>
      </div>
    </div>
  `;
};

const createTargetMultiPrize = (prize, ticketNumbers) => {
  const prizeLabel = getPrizeLabel(prize.prize_type);
  const numCount = ticketNumbers.length;
  
  // Target format uses VERY tight grids to match target
  let gridClass = 'grid-15';
  if (numCount <= 6) gridClass = 'grid-6';
  else if (numCount <= 20) gridClass = 'grid-15';
  else if (numCount <= 75) gridClass = 'grid-15';
  else if (numCount <= 100) gridClass = 'grid-20';
  else gridClass = 'grid-25'; // For 9th prize with 140+ numbers
  
  return `
    <div class="prize-row">
      <div class="prize-header-row">
        <span>${prizeLabel}</span>
        <span>₹${formatCurrency(prize.prize_amount)}/-</span>
      </div>
      <div class="prize-content-row">
        <div class="multi-prize-grid ${gridClass}">
          ${ticketNumbers.map(num => `<div class="number-cell">${num}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
};

const getTicketNumbers = (prize) => {
  if (prize.tickets) {
    return prize.tickets.map(t => t.ticket_number);
  }
  if (prize.ticket_numbers) {
    return prize.ticket_numbers.split(' ').filter(n => n.trim());
  }
  return [];
};

const sortPrizesByType = (prizes) => {
  const order = ['1st', 'consolation', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
  
  return prizes.sort((a, b) => {
    const aIndex = order.indexOf(a.prize_type.toLowerCase());
    const bIndex = order.indexOf(b.prize_type.toLowerCase());
    
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });
};

const createTargetFooter = () => {
  return `
    <div class="footer">
      ${MALAYALAM_FOOTER_TEXT.substring(0, 250)}...
    </div>
  `;
};