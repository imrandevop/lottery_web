// utils/pdfGenerator.js - FLUTTER STYLE PDF REPLICA
import { formatDate, formatCurrency, getPrizeLabel } from './formatters';

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

// Load Google Fonts for better typography
const loadGoogleFonts = () => {
  if (!document.querySelector('link[href*="Noto+Sans"]')) {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

export const generatePDF = async (resultData, darkMode = false) => {
  const jsPDFConstructor = await loadJsPDF();
  loadGoogleFonts();
  
  const doc = new jsPDFConstructor({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const usableWidth = pageWidth - 2 * margin;

  // Set default font
  doc.setFont('helvetica');

  // Add watermark background
  addWatermark(doc, pageWidth, pageHeight);

  // Add page border
  addPageBorder(doc, pageWidth, pageHeight, margin);

  let currentY = margin + 5;

  // Add header
  currentY = addFlutterStyleHeader(doc, resultData, currentY, margin, usableWidth, pageWidth);
  
  // Add divider
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // Process prizes in Flutter order
  if (resultData.prizes && resultData.prizes.length > 0) {
    const sortedPrizes = sortPrizesFlutterStyle(resultData.prizes);
    
    // 1st Prize (Top)
    const firstPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === '1st');
    if (firstPrize) {
      currentY = addFirstPrizeFlutterStyle(doc, firstPrize, currentY, margin, usableWidth, pageWidth);
    }

    // Consolation Prize (Series only)
    const consolationPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === 'consolation');
    if (consolationPrize) {
      currentY = addConsolationPrizeFlutterStyle(doc, consolationPrize, currentY, margin, usableWidth, pageWidth);
    }

    // 2nd and 3rd Prizes (Side by side)
    const secondPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === '2nd');
    const thirdPrize = sortedPrizes.find(p => p.prize_type.toLowerCase() === '3rd');
    if (secondPrize || thirdPrize) {
      currentY = addSecondThirdPrizesFlutterStyle(doc, secondPrize, thirdPrize, currentY, margin, usableWidth, pageWidth);
    }

    // Lower tier prizes (4th, 5th, 6th, etc.)
    const lowerTierPrizes = sortedPrizes.filter(p => 
      !['1st', '2nd', '3rd', 'consolation'].includes(p.prize_type.toLowerCase())
    );
    
    for (const prize of lowerTierPrizes) {
      currentY = addLowerTierPrizeFlutterStyle(doc, prize, currentY, margin, usableWidth, pageWidth);
    }
  }

  // Add footer
  addFlutterStyleFooter(doc, pageWidth, pageHeight, margin);

  // Add clickable links to entire document
  addClickableLinks(doc, pageWidth, pageHeight);

  // Save PDF
  const safeLotteryName = (resultData.lottery_name || 'lottery').replace(/[^a-zA-Z0-9]/g, '_');
  const safeDate = formatDate(resultData.date).replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeLotteryName}_${safeDate}_result.pdf`;
  
  doc.save(fileName);
};

const addWatermark = (doc, pageWidth, pageHeight) => {
  doc.setTextColor(200, 200, 200); // Light gray
  doc.setFontSize(120);
  doc.setFont('helvetica', 'bold');
  
  // Calculate center position for watermark
  const text = 'LOTTO';
  const textWidth = doc.getTextWidth(text);
  const x = (pageWidth - textWidth) / 2;
  const y = pageHeight / 2 + 20; // Slightly below center
  
  // Add watermark with low opacity effect
  doc.text(text, x, y);
};

const addPageBorder = (doc, pageWidth, pageHeight, margin) => {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
};

const addFlutterStyleHeader = (doc, resultData, currentY, margin, usableWidth, pageWidth) => {
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  
  // Main header text
  doc.setFontSize(16);
  const headerText = 'KERALA LOTTERIES - RESULT BY LOTTO';
  const headerWidth = doc.getTextWidth(headerText);
  doc.text(headerText, (pageWidth - headerWidth) / 2, currentY);
  
  currentY += 8;
  
  // Lottery details in one line
  doc.setFontSize(12);
  const lotteryName = (resultData.lottery_name || 'SUVARNA KERALAM').toUpperCase();
  const drawNumber = resultData.draw_number || 'SK-11';
  const dateStr = formatDate(resultData.date);
  
  const detailsText = `${lotteryName} NO: ${drawNumber}`;
  const detailsWidth = doc.getTextWidth(detailsText);
  const dateText = `Date: ${dateStr}`;
  const dateWidth = doc.getTextWidth(dateText);
  
  // Center the lottery details
  doc.text(detailsText, (pageWidth - detailsWidth) / 2, currentY);
  
  // Add date on the right
  doc.text(dateText, pageWidth - margin - dateWidth - 5, currentY);
  
  return currentY + 8;
};

const addFirstPrizeFlutterStyle = (doc, prize, currentY, margin, usableWidth, pageWidth) => {
  const ticketNumbers = getTicketNumbers(prize);
  if (ticketNumbers.length === 0) return currentY;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  
  // Prize label and amount on the left
  const prizeText = `1st Prize Rs: ₹${formatCurrency(prize.prize_amount)}/- [1 Crore]/-:`;
  doc.text(prizeText, margin + 5, currentY);
  
  // Winning number and location on the same line
  const ticketInfo = getTicketWithLocation(prize, ticketNumbers[0]);
  const numberText = `${ticketNumbers[0]} (${ticketInfo.location})`;
  const numberWidth = doc.getTextWidth(numberText);
  
  // Position number after the prize text
  const prizeTextWidth = doc.getTextWidth(prizeText);
  doc.text(numberText, margin + 5 + prizeTextWidth + 5, currentY);
  
  return currentY + 8;
};

const addConsolationPrizeFlutterStyle = (doc, prize, currentY, margin, usableWidth, pageWidth) => {
  const seriesNumbers = getConsolationSeries(prize);
  if (seriesNumbers.length === 0) return currentY;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  
  // Prize label
  const prizeText = `Consolation Prize Rs: ₹${formatCurrency(prize.prize_amount)}/-/-:`;
  doc.text(prizeText, margin + 5, currentY);
  
  // Series numbers on the same line
  const prizeTextWidth = doc.getTextWidth(prizeText);
  const seriesText = seriesNumbers.join(' ');
  doc.text(seriesText, margin + 5 + prizeTextWidth + 5, currentY);
  
  return currentY + 8;
};

const addSecondThirdPrizesFlutterStyle = (doc, secondPrize, thirdPrize, currentY, margin, usableWidth, pageWidth) => {
  const halfWidth = usableWidth / 2;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  
  if (secondPrize) {
    const ticketNumbers = getTicketNumbers(secondPrize);
    if (ticketNumbers.length > 0) {
      // 2nd Prize on the left
      doc.text(`2nd Prize Rs: ₹${formatCurrency(secondPrize.prize_amount)}/- [30 Lakhs]/-`, margin + 5, currentY);
      
      const ticketInfo = getTicketWithLocation(secondPrize, ticketNumbers[0]);
      const numberText = `${ticketNumbers[0]} (${ticketInfo.location})`;
      doc.text(numberText, margin + 5, currentY + 6);
      
      // Add border around 2nd prize
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.rect(margin + 2, currentY - 3, halfWidth - 10, 12);
    }
  }
  
  if (thirdPrize) {
    const ticketNumbers = getTicketNumbers(thirdPrize);
    if (ticketNumbers.length > 0) {
      // 3rd Prize on the right
      const startX = margin + halfWidth + 10;
      doc.text(`3rd Prize Rs: ₹${formatCurrency(thirdPrize.prize_amount)}/- [5 Lakhs]/-`, startX, currentY);
      
      const ticketInfo = getTicketWithLocation(thirdPrize, ticketNumbers[0]);
      const numberText = `${ticketNumbers[0]} (${ticketInfo.location})`;
      doc.text(numberText, startX, currentY + 6);
      
      // Add border around 3rd prize
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.rect(startX - 3, currentY - 3, halfWidth - 10, 12);
    }
  }
  
  return currentY + 15;
};

const addLowerTierPrizeFlutterStyle = (doc, prize, currentY, margin, usableWidth, pageWidth) => {
  const ticketNumbers = getTicketNumbers(prize);
  if (ticketNumbers.length === 0) return currentY;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  
  // Prize header
  const prizeLabel = getPrizeLabel(prize.prize_type);
  const headerText = `${prizeLabel} – Rs: ₹${formatCurrency(prize.prize_amount)}/-/-`;
  doc.text(headerText, margin + 5, currentY);
  currentY += 6;
  
  // Numbers in 15-column grid with borders
  const cols = 15;
  const cellWidth = (usableWidth - 10) / cols;
  const cellHeight = 6;
  const rows = Math.ceil(ticketNumbers.length / cols);
  
  doc.setFontSize(11);
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  
  for (let i = 0; i < ticketNumbers.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    const cellX = margin + 5 + col * cellWidth;
    const cellY = currentY + row * cellHeight;
    
    // Draw cell border
    doc.rect(cellX, cellY, cellWidth, cellHeight);
    
    // Add number text centered in cell
    const numText = ticketNumbers[i];
    const textWidth = doc.getTextWidth(numText);
    const textX = cellX + (cellWidth - textWidth) / 2;
    const textY = cellY + cellHeight / 2 + 1.5;
    
    doc.text(numText, textX, textY);
  }
  
  return currentY + (rows * cellHeight) + 8;
};

const addFlutterStyleFooter = (doc, pageWidth, pageHeight, margin) => {
  const footerY = pageHeight - margin - 15;
  
  // Add divider
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  // Footer text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  const footerText = 'The prize winners are advised to verify the winning numbers with the results published in the Kerala Government Gazette and surrender the winning tickets within 90 days.';
  
  // Split text to fit width
  const maxWidth = pageWidth - 2 * margin - 10;
  const lines = doc.splitTextToSize(footerText, maxWidth);
  
  // Center align footer text
  for (let i = 0; i < lines.length; i++) {
    const lineWidth = doc.getTextWidth(lines[i]);
    const x = (pageWidth - lineWidth) / 2;
    doc.text(lines[i], x, footerY + 8 + (i * 4));
  }
};

const addClickableLinks = (doc, pageWidth, pageHeight) => {
  // Add invisible clickable area over entire page
  doc.link(0, 0, pageWidth, pageHeight, { url: 'https://www.lottokeralalotteries.com' });
};

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