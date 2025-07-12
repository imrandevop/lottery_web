// utils/pdfGenerator.js - IMPROVED VERSION WITH BETTER READABILITY
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
  const margin = 4;
  const usableWidth = pageWidth - 2 * margin;

  // Outer border - thicker for better visibility
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.2);
  doc.rect(margin, margin, usableWidth, pageHeight - 2 * margin);

  let currentY = margin + 1;

  // Header section
  currentY = addImprovedHeader(doc, resultData, currentY, margin, usableWidth, pageWidth);

  // Process prizes
  if (resultData.prizes && resultData.prizes.length > 0) {
    // Sort prizes by type for proper display order
    const sortedPrizes = sortPrizesByType(resultData.prizes);
    
    for (let i = 0; i < sortedPrizes.length; i++) {
      const prize = sortedPrizes[i];
      const ticketNumbers = getTicketNumbers(prize);
      
      if (prize.prize_type.toLowerCase() === '1st') {
        currentY = addFirstPrizeImproved(doc, prize, ticketNumbers[0], currentY, margin, usableWidth, pageWidth);
      } else if (prize.prize_type.toLowerCase() === 'consolation') {
        currentY = addConsolationPrizeImproved(doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth);
      } else if (['2nd', '3rd'].includes(prize.prize_type.toLowerCase())) {
        currentY = addSinglePrizeImproved(doc, prize, ticketNumbers[0], currentY, margin, usableWidth, pageWidth);
      } else {
        currentY = addMultiPrizeImproved(doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth);
      }
    }
  }

  // Footer
  addImprovedFooter(doc, pageWidth, pageHeight, margin);

  // Save
  const safeLotteryName = (resultData.lottery_name || 'lottery').replace(/[^a-zA-Z0-9]/g, '_');
  const safeDate = formatDate(resultData.date).replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeLotteryName}_${safeDate}_result.pdf`;
  
  doc.save(fileName);
};

const addImprovedHeader = (doc, resultData, currentY, margin, usableWidth, pageWidth) => {
  // Header background - darker gray for better contrast
  doc.setFillColor(180, 180, 180);
  doc.rect(margin, currentY, usableWidth, 14, 'F');
  
  // Header border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, currentY, usableWidth, 14);

  // Header text - larger and bolder
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  
  const drawNumber = resultData.draw_number || 'KN-XXX';
  const lotteryName = resultData.lottery_name || 'Kerala Lottery';
  const dateStr = formatDate(resultData.date);
  
  // Left: Draw number
  doc.text(drawNumber, margin + 3, currentY + 8);
  
  // Center: Lottery name
  const titleWidth = doc.getTextWidth(lotteryName);
  doc.text(lotteryName, (pageWidth - titleWidth) / 2, currentY + 8);
  
  // Right: Date
  const dateWidth = doc.getTextWidth(dateStr);
  doc.text(dateStr, pageWidth - margin - dateWidth - 3, currentY + 8);

  // Add Malayalam text - more prominent
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const malayalamText = "കാരുണ്യ പ്ലസ്";
  const malayalamWidth = doc.getTextWidth(malayalamText);
  doc.text(malayalamText, (pageWidth - malayalamWidth) / 2, currentY + 11.5);

  return currentY + 17;
};

const addFirstPrizeImproved = (doc, prize, ticketNumber, currentY, margin, usableWidth, pageWidth) => {
  // Prize header with amount - more prominent
  doc.setFillColor(220, 220, 220);
  doc.rect(margin, currentY, usableWidth, 10, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, currentY, usableWidth, 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const prizeText = `ഒന്നാം സമ്മാനം ₹${formatCurrency(prize.prize_amount)}/-`;
  const prizeWidth = doc.getTextWidth(prizeText);
  doc.text(prizeText, (pageWidth - prizeWidth) / 2, currentY + 6.5);

  currentY += 12;

  // Large winning number - bigger and more prominent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  const numberWidth = doc.getTextWidth(ticketNumber);
  const numberX = (pageWidth - numberWidth) / 2;
  doc.text(ticketNumber, numberX, currentY + 9);

  // Box around number - thicker border
  doc.setLineWidth(1.5);
  doc.rect(numberX - 5, currentY + 1, numberWidth + 10, 12);

  currentY += 15;

  // Location if available - larger font
  if (prize.tickets && prize.tickets[0] && prize.tickets[0].location) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const location = `(${prize.tickets[0].location})`;
    const locationWidth = doc.getTextWidth(location);
    doc.text(location, (pageWidth - locationWidth) / 2, currentY + 3);
    currentY += 6;
  }

  // Separator line - thicker
  doc.setLineWidth(0.8);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  return currentY + 5;
};

const addConsolationPrizeImproved = (doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth) => {
  // Consolation header - more prominent
  doc.setFillColor(210, 210, 210);
  doc.rect(margin, currentY, usableWidth, 8, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.rect(margin, currentY, usableWidth, 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  
  const consolationText = `സമാധാന സമ്മാനം ${ticketNumbers.length} പേർക്ക് ₹${formatCurrency(prize.prize_amount)}/- വീതം`;
  const consolationWidth = doc.getTextWidth(consolationText);
  doc.text(consolationText, (pageWidth - consolationWidth) / 2, currentY + 5.5);

  currentY += 10;

  // Consolation numbers - larger and more readable
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  
  let consolationLine = "";
  ticketNumbers.forEach((num, index) => {
    if (index > 0) consolationLine += "  ";
    consolationLine += num;
  });
  
  const lineWidth = doc.getTextWidth(consolationLine);
  const startX = (pageWidth - lineWidth) / 2;
  doc.text(consolationLine, startX, currentY + 5);

  // Box around consolation numbers - thicker
  doc.setLineWidth(0.8);
  doc.rect(startX - 3, currentY + 1, lineWidth + 6, 7);

  currentY += 10;

  // Separator line
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  return currentY + 3;
};

const addSinglePrizeImproved = (doc, prize, ticketNumber, currentY, margin, usableWidth, pageWidth) => {
  // Prize header - more prominent
  doc.setFillColor(235, 235, 235);
  doc.rect(margin, currentY, usableWidth, 7, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.rect(margin, currentY, usableWidth, 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  
  const prizeLabel = getPrizeLabel(prize.prize_type);
  const malayalamPrize = prizeLabel === '2nd Prize' ? 'രണ്ടാം സമ്മാനം' : 'മൂന്നാം സമ്മാനം';
  
  doc.text(`${malayalamPrize} ₹${formatCurrency(prize.prize_amount)}/-`, margin + 3, currentY + 4.5);

  // Location on right if available
  if (prize.tickets && prize.tickets[0] && prize.tickets[0].location) {
    const location = `(${prize.tickets[0].location})`;
    const locationWidth = doc.getTextWidth(location);
    doc.text(location, pageWidth - margin - locationWidth - 3, currentY + 4.5);
  }

  currentY += 8;

  // Number - larger and more readable
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const numberWidth = doc.getTextWidth(ticketNumber);
  const numberX = (pageWidth - numberWidth) / 2;
  doc.text(ticketNumber, numberX, currentY + 7);

  // Box around number
  doc.setLineWidth(0.8);
  doc.rect(numberX - 4, currentY + 1, numberWidth + 8, 9);

  currentY += 12;

  // Separator line
  doc.setLineWidth(0.6);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  return currentY + 3;
};

const addMultiPrizeImproved = (doc, prize, ticketNumbers, currentY, margin, usableWidth, pageWidth) => {
  // Prize header - more visible
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, currentY, usableWidth, 6, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, currentY, usableWidth, 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 0, 0);
  
  const prizeLabel = getPrizeLabel(prize.prize_type);
  const malayalamPrize = getmalayalamPrizeLabel(prize.prize_type);
  
  doc.text(`${malayalamPrize} ${ticketNumbers.length} പേർക്ക് ₹${formatCurrency(prize.prize_amount)}/- വീതം`, margin + 2, currentY + 4);

  currentY += 7;

  // Determine grid layout based on number count
  const numCount = ticketNumbers.length;
  let cols = 10;
  if (numCount > 120) cols = 25;
  else if (numCount > 80) cols = 20;
  else if (numCount > 40) cols = 15;
  else if (numCount > 20) cols = 12;

  const cellWidth = (usableWidth - 2) / cols;
  const cellHeight = 5;

  // Draw numbers in grid - larger font
  for (let i = 0; i < ticketNumbers.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    const cellX = margin + 1 + col * cellWidth;
    const cellY = currentY + row * cellHeight;
    
    // Cell border
    doc.setLineWidth(0.3);
    doc.rect(cellX, cellY, cellWidth, cellHeight);
    
    // Number text - larger and more readable
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    const numText = ticketNumbers[i];
    const textWidth = doc.getTextWidth(numText);
    const textX = cellX + (cellWidth - textWidth) / 2;
    const textY = cellY + cellHeight / 2 + 1.8;
    
    doc.text(numText, textX, textY);
  }
  
  const totalRows = Math.ceil(ticketNumbers.length / cols);
  currentY += totalRows * cellHeight + 2;

  // Separator line
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  return currentY + 2;
};

const addImprovedFooter = (doc, pageWidth, pageHeight, margin) => {
  const footerY = pageHeight - margin - 8;
  
  // Footer line
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  // Footer text - slightly larger
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(60, 60, 60);
  
  const footerText = MALAYALAM_FOOTER_TEXT.substring(0, 200);
  const maxLineWidth = pageWidth - 2 * margin - 4;
  const lines = doc.splitTextToSize(footerText, maxLineWidth);
  
  for (let i = 0; i < Math.min(lines.length, 2); i++) {
    doc.text(lines[i], margin + 2, footerY + 3 + (i * 2));
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