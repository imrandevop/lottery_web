// utils/pdfGenerator.js - EXACT PDF REPLICA - COMPACT A4 FIT
import { formatDate, formatCurrency, getPrizeLabel } from './formatters';
import { MALAYALAM_FOOTER_TEXT } from './constants';

const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jsPDF && typeof window.jsPDF === 'function') {
      resolve(window.jsPDF);
      return;
    }

    const cdnSources = [
      'https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
    ];

    let currentCdnIndex = 0;

    const tryLoadFromCdn = () => {
      if (currentCdnIndex >= cdnSources.length) {
        reject(new Error('All CDN sources failed to load jsPDF'));
        return;
      }

      const script = document.createElement('script');
      script.src = cdnSources[currentCdnIndex];
      script.type = 'text/javascript';

      script.onload = () => {
        let checkAttempts = 0;
        const maxChecks = 20;
        
        const checkForjsPDF = () => {
          checkAttempts++;
          let jsPDFConstructor = null;

          if (typeof window.jsPDF === 'function') {
            jsPDFConstructor = window.jsPDF;
          } else if (window.jspdf && typeof window.jspdf.jsPDF === 'function') {
            jsPDFConstructor = window.jspdf.jsPDF;
          } else if (window.jsPDF && typeof window.jsPDF.jsPDF === 'function') {
            jsPDFConstructor = window.jsPDF.jsPDF;
          }

          if (jsPDFConstructor) {
            try {
              const testDoc = new jsPDFConstructor();
              if (testDoc && typeof testDoc.save === 'function') {
                resolve(jsPDFConstructor);
                return;
              }
            } catch (testError) {
              // Test failed, continue checking
            }
          }

          if (checkAttempts < maxChecks) {
            setTimeout(checkForjsPDF, 300);
          } else {
            currentCdnIndex++;
            script.remove();
            tryLoadFromCdn();
          }
        };

        checkForjsPDF();
      };

      script.onerror = () => {
        currentCdnIndex++;
        script.remove();
        tryLoadFromCdn();
      };

      document.head.appendChild(script);
    };

    tryLoadFromCdn();
  });
};

export const generatePDF = async (resultData, darkMode = false) => {
  const jsPDFConstructor = await loadJsPDF();
  
  const doc = new jsPDFConstructor({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 3;
  const usableWidth = pageWidth - 2 * margin;

  // Outer border - exactly like PDF
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, margin, usableWidth, pageHeight - 2 * margin);

  let currentY = margin + 1;

  // Header section - compact
  currentY = addCompactHeader(doc, resultData, currentY, margin, usableWidth, pageWidth);

  // Process prizes - compact layout
  if (resultData.prizes && resultData.prizes.length > 0) {
    const sortedPrizes = sortPrizesByType(resultData.prizes);
    
    for (let i = 0; i < sortedPrizes.length; i++) {
      const prize = sortedPrizes[i];
      const ticketNumbers = getTicketNumbers(prize);
      
      if (prize.prize_type.toLowerCase() === '1st') {
        currentY = addCompactFirstPrize(doc, prize, ticketNumbers[0], currentY, margin, usableWidth, pageWidth);
      } else if (prize.prize_type.toLowerCase() === 'consolation') {
        currentY = addCompactConsolationPrize(doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth);
      } else if (['2nd', '3rd'].includes(prize.prize_type.toLowerCase())) {
        currentY = addCompactSinglePrize(doc, prize, ticketNumbers[0], currentY, margin, usableWidth, pageWidth);
      } else {
        currentY = addCompactMultiPrize(doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth);
      }
      
      // Minimal spacing between sections
      currentY += 1;
    }
  }

  // Footer - compact
  addCompactFooter(doc, pageWidth, pageHeight, margin);

  // Save
  const safeLotteryName = (resultData.lottery_name || 'lottery').replace(/[^a-zA-Z0-9]/g, '_');
  const safeDate = formatDate(resultData.date).replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeLotteryName}_${safeDate}_result.pdf`;
  
  doc.save(fileName);
};

const addCompactHeader = (doc, resultData, currentY, margin, usableWidth, pageWidth) => {
  // Header with border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, currentY, usableWidth, 10);

  // Header text
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  
  const drawNumber = resultData.draw_number || 'SK-11';
  const lotteryName = resultData.lottery_name || 'SUVARNA KERALAM';
  const dateStr = formatDate(resultData.date);
  
  // Left: Draw number
  doc.text(drawNumber, margin + 2, currentY + 6);
  
  // Center: Lottery name
  doc.setFontSize(14);
  const titleWidth = doc.getTextWidth(lotteryName);
  doc.text(lotteryName, (pageWidth - titleWidth) / 2, currentY + 6);
  
  // Right: Date
  doc.setFontSize(11);
  const dateWidth = doc.getTextWidth(dateStr);
  doc.text(dateStr, pageWidth - margin - dateWidth - 2, currentY + 6);

  return currentY + 12;
};

const addCompactFirstPrize = (doc, prize, ticketNumber, currentY, margin, usableWidth, pageWidth) => {
  const sectionHeight = 14;
  
  // Prize section border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, currentY, usableWidth, sectionHeight);

  // Prize header background
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, currentY, usableWidth, 5, 'F');
  
  // Header border
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);

  // Prize header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  // Left: Prize label
  doc.text('1st Prize', margin + 2, currentY + 3.5);
  
  // Right: Prize amount
  const amountText = `₹${formatCurrency(prize.prize_amount)}/-`;
  const amountWidth = doc.getTextWidth(amountText);
  doc.text(amountText, pageWidth - margin - amountWidth - 2, currentY + 3.5);

  // Winning number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  const numberWidth = doc.getTextWidth(ticketNumber);
  const numberX = (pageWidth - numberWidth) / 2;
  doc.text(ticketNumber, numberX, currentY + 10);

  // Box around number
  doc.setLineWidth(0.8);
  doc.rect(numberX - 2, currentY + 7, numberWidth + 4, 5);

  // Location if available
  if (prize.tickets && prize.tickets[0] && prize.tickets[0].location) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const location = `(${prize.tickets[0].location.toUpperCase()})`;
    const locationWidth = doc.getTextWidth(location);
    doc.text(location, (pageWidth - locationWidth) / 2, currentY + 13);
  }

  return currentY + sectionHeight;
};

const addCompactConsolationPrize = (doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth) => {
  const cols = 10;
  const rows = Math.ceil(ticketNumbers.length / cols);
  const sectionHeight = 5 + rows * 4 + 1;

  // Prize section border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, currentY, usableWidth, sectionHeight);

  // Header background
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, currentY, usableWidth, 5, 'F');

  // Header border
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);

  // Prize header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  // Left: Prize label
  doc.text('Consolation Prize', margin + 2, currentY + 3.5);
  
  // Right: Prize amount
  const amountText = `₹${formatCurrency(prize.prize_amount)}/-`;
  const amountWidth = doc.getTextWidth(amountText);
  doc.text(amountText, pageWidth - margin - amountWidth - 2, currentY + 3.5);

  // Consolation numbers in compact 10-column grid
  const cellWidth = (usableWidth - 4) / cols;
  const cellHeight = 4;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  
  for (let i = 0; i < ticketNumbers.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    const cellX = margin + 2 + col * cellWidth;
    const cellY = currentY + 6 + row * cellHeight;
    
    // Cell border
    doc.setLineWidth(0.3);
    doc.rect(cellX, cellY, cellWidth, cellHeight);
    
    // Number text
    const numText = ticketNumbers[i];
    const textWidth = doc.getTextWidth(numText);
    const textX = cellX + (cellWidth - textWidth) / 2;
    const textY = cellY + cellHeight / 2 + 1.2;
    
    doc.text(numText, textX, textY);
  }

  return currentY + sectionHeight;
};

const addCompactSinglePrize = (doc, prize, ticketNumber, currentY, margin, usableWidth, pageWidth) => {
  const sectionHeight = 12;
  
  // Prize section border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, currentY, usableWidth, sectionHeight);

  // Prize header background
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, currentY, usableWidth, 5, 'F');
  
  // Header border
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);

  // Prize header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  const prizeLabel = prize.prize_type === '2nd' ? '2nd Prize' : '3rd Prize';
  
  // Left: Prize label
  doc.text(prizeLabel, margin + 2, currentY + 3.5);
  
  // Right: Prize amount
  const amountText = `₹${formatCurrency(prize.prize_amount)}/-`;
  const amountWidth = doc.getTextWidth(amountText);
  doc.text(amountText, pageWidth - margin - amountWidth - 2, currentY + 3.5);

  // Winning number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const numberWidth = doc.getTextWidth(ticketNumber);
  const numberX = (pageWidth - numberWidth) / 2;
  doc.text(ticketNumber, numberX, currentY + 9);

  // Box around number
  doc.setLineWidth(0.8);
  doc.rect(numberX - 2, currentY + 6.5, numberWidth + 4, 4);

  // Location if available
  if (prize.tickets && prize.tickets[0] && prize.tickets[0].location) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const location = `(${prize.tickets[0].location.toUpperCase()})`;
    const locationWidth = doc.getTextWidth(location);
    doc.text(location, (pageWidth - locationWidth) / 2, currentY + 11.5);
  }

  return currentY + sectionHeight;
};

const addCompactMultiPrize = (doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth) => {
  const numCount = ticketNumbers.length;
  
  // Determine compact grid layout
  let cols = 15;
  if (numCount <= 6) cols = 6;
  else if (numCount <= 100) cols = 15;
  else cols = 20;
  
  const rows = Math.ceil(numCount / cols);
  const sectionHeight = 5 + rows * 3.5 + 1;

  // Prize section border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, currentY, usableWidth, sectionHeight);

  // Header background
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, currentY, usableWidth, 5, 'F');

  // Header border
  doc.setLineWidth(0.5);
  doc.line(margin, currentY + 5, pageWidth - margin, currentY + 5);

  // Prize header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  const prizeLabel = getPrizeLabel(prize.prize_type);
  
  // Left: Prize label
  doc.text(prizeLabel, margin + 2, currentY + 3.5);
  
  // Right: Prize amount
  const amountText = `₹${formatCurrency(prize.prize_amount)}/-`;
  const amountWidth = doc.getTextWidth(amountText);
  doc.text(amountText, pageWidth - margin - amountWidth - 2, currentY + 3.5);

  // Numbers in compact grid
  const cellWidth = (usableWidth - 4) / cols;
  const cellHeight = 3.5;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  
  for (let i = 0; i < ticketNumbers.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    const cellX = margin + 2 + col * cellWidth;
    const cellY = currentY + 6 + row * cellHeight;
    
    // Cell border
    doc.setLineWidth(0.2);
    doc.rect(cellX, cellY, cellWidth, cellHeight);
    
    // Number text
    const numText = ticketNumbers[i];
    const textWidth = doc.getTextWidth(numText);
    const textX = cellX + (cellWidth - textWidth) / 2;
    const textY = cellY + cellHeight / 2 + 1;
    
    doc.text(numText, textX, textY);
  }

  return currentY + sectionHeight;
};

const addCompactFooter = (doc, pageWidth, pageHeight, margin) => {
  const footerY = pageHeight - margin - 8;
  
  // Footer text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(50, 50, 50);
  
  const footerText = MALAYALAM_FOOTER_TEXT.substring(0, 200);
  const maxLineWidth = pageWidth - 2 * margin - 4;
  const lines = doc.splitTextToSize(footerText, maxLineWidth);
  
  for (let i = 0; i < Math.min(lines.length, 2); i++) {
    doc.text(lines[i], margin + 2, footerY + 2 + (i * 2.5));
  }
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