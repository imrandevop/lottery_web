// utils/printUtils.js - IMPROVED VERSION WITH BETTER READABILITY
import { formatDate, formatCurrency, getPrizeLabel } from './formatters';
import { MALAYALAM_FOOTER_TEXT } from './constants';

export const createPrintContent = (resultData, darkMode = false) => {
  const printStyles = generateImprovedPrintStyles();
  
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
        ${createImprovedHeader(resultData)}
        ${createImprovedContent(resultData)}
        ${createImprovedFooter()}
      </div>
    </body>
    </html>
  `;
};

const generateImprovedPrintStyles = () => {
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
          font-size: 9px;
          line-height: 1.2;
          color: black;
        }
        
        .container {
          width: 100%;
          border: 2px solid black;
          position: relative;
          min-height: 285mm;
        }
        
        .header {
          border-bottom: 2px solid black;
          padding: 4mm;
          background: #b4b4b4;
          position: relative;
          height: 14mm;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: bold;
          font-size: 11px;
        }
        
        .header-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }
        
        .malayalam-subtitle {
          font-size: 8px;
          font-weight: normal;
          margin-top: 1mm;
        }
        
        .content {
          padding: 2mm;
        }
        
        .first-prize {
          text-align: center;
          margin-bottom: 5mm;
          border-bottom: 2px solid black;
          padding-bottom: 4mm;
        }
        
        .first-prize-header {
          background: #dcdcdc;
          padding: 3mm;
          border: 2px solid black;
          font-weight: bold;
          font-size: 10px;
          margin-bottom: 3mm;
        }
        
        .first-number {
          font-size: 28px;
          font-weight: bold;
          border: 3px solid black;
          padding: 4mm 8mm;
          margin: 3mm 0;
          display: inline-block;
        }
        
        .location {
          font-size: 7px;
          margin-top: 2mm;
          font-weight: normal;
        }
        
        .consolation-section {
          margin-bottom: 4mm;
          border-bottom: 2px solid black;
          padding-bottom: 3mm;
        }
        
        .consolation-header {
          background: #d2d2d2;
          padding: 2.5mm;
          border: 2px solid black;
          font-weight: bold;
          font-size: 8px;
          margin-bottom: 3mm;
          text-align: center;
        }
        
        .consolation-numbers {
          text-align: center;
          font-weight: bold;
          font-size: 9px;
          border: 2px solid black;
          padding: 2.5mm;
          letter-spacing: 1px;
        }
        
        .single-prize {
          margin-bottom: 3mm;
          border-bottom: 1px solid black;
          padding-bottom: 3mm;
        }
        
        .single-prize-header {
          background: #ebebeb;
          padding: 2mm;
          border: 1px solid black;
          font-weight: bold;
          font-size: 7px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 2mm;
        }
        
        .single-number {
          font-size: 18px;
          font-weight: bold;
          border: 2px solid black;
          padding: 3mm 5mm;
          display: inline-block;
          text-align: center;
        }
        
        .multi-prize {
          margin-bottom: 3mm;
          border-bottom: 1px solid black;
          padding-bottom: 2mm;
        }
        
        .multi-prize-header {
          background: #f5f5f5;
          padding: 1.5mm;
          border: 1px solid black;
          font-weight: bold;
          font-size: 6.5px;
          margin-bottom: 2mm;
        }
        
        .numbers-grid {
          display: grid;
          gap: 0.3mm;
          margin: 2mm 0;
        }
        
        .grid-10 { grid-template-columns: repeat(10, 1fr); }
        .grid-12 { grid-template-columns: repeat(12, 1fr); }
        .grid-15 { grid-template-columns: repeat(15, 1fr); }
        .grid-20 { grid-template-columns: repeat(20, 1fr); }
        .grid-25 { grid-template-columns: repeat(25, 1fr); }
        
        .number-cell {
          border: 0.3mm solid black;
          text-align: center;
          padding: 1.5mm 0.5mm;
          font-weight: bold;
          font-size: 6px;
          height: 5mm;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .footer {
          position: absolute;
          bottom: 2mm;
          left: 2mm;
          right: 2mm;
          border-top: 1px solid black;
          padding-top: 2mm;
          font-size: 5px;
          text-align: center;
          color: #444;
        }
      }
    </style>
  `;
};

const createImprovedHeader = (resultData) => {
  return `
    <div class="header">
      <span>${resultData.draw_number || 'KN-XXX'}</span>
      <div class="header-center">
        <div>${resultData.lottery_name}</div>
        <div class="malayalam-subtitle">കാരുണ്യ പ്ലസ്</div>
      </div>
      <span>${formatDate(resultData.date)}</span>
    </div>
  `;
};

const createImprovedContent = (resultData) => {
  if (!resultData.prizes) return '';
  
  // Sort prizes by type for proper display order
  const sortedPrizes = sortPrizesByType(resultData.prizes);
  let html = '';
  
  sortedPrizes.forEach((prize) => {
    const ticketNumbers = getTicketNumbers(prize);
    const prizeType = prize.prize_type.toLowerCase();
    
    if (prizeType === '1st') {
      html += createImprovedFirstPrizeSection(prize, ticketNumbers[0]);
    } else if (prizeType === 'consolation') {
      html += createImprovedConsolationSection(prize, ticketNumbers);
    } else if (['2nd', '3rd'].includes(prizeType)) {
      html += createImprovedSinglePrizeSection(prize, ticketNumbers[0]);
    } else {
      html += createImprovedMultiPrizeSection(prize, ticketNumbers);
    }
  });
  
  return `<div class="content">${html}</div>`;
};

const createImprovedFirstPrizeSection = (prize, ticketNumber) => {
  return `
    <div class="first-prize">
      <div class="first-prize-header">
        ഒന്നാം സമ്മാനം ₹${formatCurrency(prize.prize_amount)}/-
      </div>
      <div class="first-number">${ticketNumber}</div>
      ${prize.tickets && prize.tickets[0] && prize.tickets[0].location ? 
        `<div class="location">(${prize.tickets[0].location})</div>` : ''}
    </div>
  `;
};

const createImprovedConsolationSection = (prize, ticketNumbers) => {
  return `
    <div class="consolation-section">
      <div class="consolation-header">
        സമാധാന സമ്മാനം ${ticketNumbers.length} പേർക്ക് ₹${formatCurrency(prize.prize_amount)}/- വീതം
      </div>
      <div class="consolation-numbers">
        ${ticketNumbers.join('  ')}
      </div>
    </div>
  `;
};

const createImprovedSinglePrizeSection = (prize, ticketNumber) => {
  const malayalamPrize = prize.prize_type.toLowerCase() === '2nd' ? 'രണ്ടാം സമ്മാനം' : 'മൂന്നാം സമ്മാനം';
  const location = prize.tickets && prize.tickets[0] && prize.tickets[0].location ? 
    `(${prize.tickets[0].location})` : '';
  
  return `
    <div class="single-prize">
      <div class="single-prize-header">
        <span>${malayalamPrize} ₹${formatCurrency(prize.prize_amount)}/-</span>
        <span>${location}</span>
      </div>
      <div style="text-align: center;">
        <div class="single-number">${ticketNumber}</div>
      </div>
    </div>
  `;
};

const createImprovedMultiPrizeSection = (prize, ticketNumbers) => {
  const malayalamPrize = getmalayalamPrizeLabel(prize.prize_type);
  
  // Determine grid layout based on number count
  const numCount = ticketNumbers.length;
  let gridClass = 'grid-10';
  if (numCount > 120) gridClass = 'grid-25';
  else if (numCount > 80) gridClass = 'grid-20';
  else if (numCount > 40) gridClass = 'grid-15';
  else if (numCount > 20) gridClass = 'grid-12';
  
  return `
    <div class="multi-prize">
      <div class="multi-prize-header">
        ${malayalamPrize} ${ticketNumbers.length} പേർക്ക് ₹${formatCurrency(prize.prize_amount)}/- വീതം
      </div>
      <div class="numbers-grid ${gridClass}">
        ${ticketNumbers.map(num => `<div class="number-cell">${num}</div>`).join('')}
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

const getmalayalamPrizeLabel = (prizeType) => {
  const type = prizeType.toLowerCase();
  switch (type) {
    case '4th': return 'നാലാം സമ്മാനം';
    case '5th': return 'അഞ്ചാം സമ്മാനം';
    case '6th': return 'ആറാം സമ്മാനം';
    case '7th': return 'ഏഴാം സമ്മാനം';
    case '8th': return 'എട്ടാം സമ്മാനം';
    default: return `${prizeType} സമ്മാനം`;
  }
};

const createImprovedFooter = () => {
  return `
    <div class="footer">
      ${MALAYALAM_FOOTER_TEXT.substring(0, 180)}...
    </div>
  `;
};