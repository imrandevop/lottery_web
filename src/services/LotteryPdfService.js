import jsPDF from 'jspdf';
import 'jspdf-autotable';

class LotteryPdfService {
  constructor() {
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.contentHeight = this.pageHeight - (this.margin * 2);
  }

  // Main function to generate and download PDF
  async generateAndDownloadLotteryResult(result) {
    try {
      const pdf = await this._generateLotteryResultPdf(result);
      const fileName = `lottery_result_${this._sanitizeText(result.lottery_code || 'result')}_${result.draw_number}.pdf`;
      pdf.save(fileName);
      return pdf;
    } catch (error) {
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  // Generate PDF bytes for sharing
  async generateLotteryResultPdfBytes(result) {
    try {
      const pdf = await this._generateLotteryResultPdf(result);
      return pdf.output('blob');
    } catch (error) {
      throw new Error(`Failed to generate PDF bytes: ${error.message}`);
    }
  }

  // Share PDF using Web Share API
  async shareResultPdf(result) {
    if (!navigator.share) {
      throw new Error('Web Share API not supported in this browser');
    }

    try {
      const pdfBlob = await this.generateLotteryResultPdfBytes(result);
      const file = new File([pdfBlob], `lottery_result_${result.draw_number}.pdf`, {
        type: 'application/pdf'
      });

      await navigator.share({
        title: `Kerala Lottery Result: ${result.lottery_name} - Draw ${result.draw_number}`,
        text: `Kerala Lottery Result: ${result.lottery_name} - Draw ${result.draw_number}`,
        files: [file]
      });
    } catch (error) {
      // Fallback to download if sharing fails
      await this.generateAndDownloadLotteryResult(result);
    }
  }

  // Core PDF generation logic
  async _generateLotteryResultPdf(result) {
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    
    // Set default font
    pdf.setFont('helvetica');
    
    let currentY = this.margin;

    // Add page border and watermark
    this._addPageBorderAndWatermark(pdf);

    // Add header
    currentY = this._addHeader(pdf, result, currentY);

    // Process prizes
    const { highTierPrizes, consolationPrize, lowerTierPrizes } = this._categorizePrizes(result.prizes);

    // Add first prize
    const firstPrize = highTierPrizes.find(p => p.prize_type.toLowerCase() === '1st');
    if (firstPrize) {
      currentY = this._addHighTierPrize(pdf, firstPrize, currentY, true);
    }

    // Add consolation prize
    if (consolationPrize) {
      currentY = this._addConsolationPrize(pdf, consolationPrize, currentY);
    }

    // Add second and third prizes in a row
    const secondPrize = highTierPrizes.find(p => p.prize_type.toLowerCase() === '2nd');
    const thirdPrize = highTierPrizes.find(p => p.prize_type.toLowerCase() === '3rd');
    
    if (secondPrize || thirdPrize) {
      currentY = this._addSecondThirdPrizes(pdf, secondPrize, thirdPrize, currentY);
    }

    // Add lower tier prizes
    for (const prize of lowerTierPrizes) {
      currentY = this._addLowerTierPrize(pdf, prize, currentY);
      
      // Check if we need a new page
      if (currentY > this.pageHeight - 40) {
        pdf.addPage();
        this._addPageBorderAndWatermark(pdf);
        currentY = this.margin + 20;
      }
    }

    // Add footer
    this._addFooter(pdf);

    return pdf;
  }

  // Add page border and watermark
  _addPageBorderAndWatermark(pdf) {
    // Page border
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(this.margin - 5, this.margin - 5, this.contentWidth + 10, this.contentHeight + 10);

    // Watermark
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(60);
    pdf.setFont('helvetica', 'bold');
    
    // Calculate center position for watermark
    const watermarkText = 'LOTTO';
    const textWidth = pdf.getTextWidth(watermarkText);
    const x = (this.pageWidth - textWidth) / 2;
    const y = this.pageHeight / 2;
    
    // Rotate and add watermark
    pdf.text(watermarkText, x, y, { angle: 45 });
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
  }

  // Add header
  _addHeader(pdf, result, startY) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    
    let y = startY;
    
    // Main title
    const title = 'KERALA LOTTERIES - RESULT BY LOTTO';
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (this.pageWidth - titleWidth) / 2, y);
    
    y += 8;
    
    // Lottery details in a row
    pdf.setFontSize(10);
    const lotteryName = `${this._sanitizeText(result.lottery_name.toUpperCase())} NO: ${this._sanitizeText(result.draw_number)}`;
    const date = `Date: ${this._sanitizeText(result.date || result.formatted_date || '')}`;
    
    const leftX = this.margin;
    const rightX = this.pageWidth - this.margin;
    
    pdf.text(lotteryName, leftX, y);
    const dateWidth = pdf.getTextWidth(date);
    pdf.text(date, rightX - dateWidth, y);
    
    y += 8;
    
    // Divider line
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.3);
    pdf.line(this.margin, y, this.pageWidth - this.margin, y);
    
    return y + 8;
  }

  // Add high tier prize (1st, 2nd, 3rd)
  _addHighTierPrize(pdf, prize, startY, isFirstPrize = false) {
    let y = startY;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    
    const prizeText = `${this._getPrizeLabel(prize.prize_type)} Rs: ${this._formatCurrency(prize.prize_amount)}/-`;
    
    if (isFirstPrize) {
      // First prize: title and numbers side by side
      const prizeTextWidth = pdf.getTextWidth(prizeText + ': ');
      pdf.text(prizeText + ': ', this.margin, y);
      
      // Add tickets next to title
      const ticketX = this.margin + prizeTextWidth + 5;
      const availableWidth = this.pageWidth - this.margin - ticketX;
      y = this._addTicketGrid(pdf, prize.tickets || [], ticketX, y - 3, availableWidth, 1);
    } else {
      // Other prizes: title above, numbers below
      pdf.text(prizeText, this.margin, y);
      y += 6;
      y = this._addTicketGrid(pdf, prize.tickets || [], this.margin, y, this.contentWidth, 1);
    }
    
    return y + 8;
  }

  // Add consolation prize
  _addConsolationPrize(pdf, prize, startY) {
    let y = startY;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    
    const prizeText = `Consolation Prize Rs: ${this._formatCurrency(prize.prize_amount)}/- : `;
    const prizeTextWidth = pdf.getTextWidth(prizeText);
    
    pdf.text(prizeText, this.margin, y);
    
    // Add series numbers
    const seriesX = this.margin + prizeTextWidth + 5;
    const availableWidth = this.pageWidth - this.margin - seriesX;
    
    if (prize.series_only && prize.series_only.length > 0) {
      let currentX = seriesX;
      let currentLineY = y;
      
      pdf.setFontSize(10);
      
      for (const series of prize.series_only) {
        const seriesWidth = pdf.getTextWidth(series + '  ');
        
        if (currentX + seriesWidth > this.pageWidth - this.margin) {
          currentLineY += 5;
          currentX = seriesX;
        }
        
        pdf.text(series, currentX, currentLineY);
        currentX += seriesWidth;
      }
      
      y = currentLineY;
    }
    
    return y + 8;
  }

  // Add second and third prizes in a row
  _addSecondThirdPrizes(pdf, secondPrize, thirdPrize, startY) {
    let y = startY;
    const halfWidth = this.contentWidth / 2 - 10;
    
    if (secondPrize) {
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const prizeText = `${this._getPrizeLabel(secondPrize.prize_type)} Rs: ${this._formatCurrency(secondPrize.prize_amount)}/-`;
      pdf.text(prizeText, this.margin, y);
      
      const ticketY = y + 6;
      this._addTicketGrid(pdf, secondPrize.tickets || [], this.margin, ticketY, halfWidth, 1);
    }
    
    if (thirdPrize) {
      const rightX = this.margin + halfWidth + 20;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const prizeText = `${this._getPrizeLabel(thirdPrize.prize_type)} Rs: ${this._formatCurrency(thirdPrize.prize_amount)}/-`;
      pdf.text(prizeText, rightX, y);
      
      const ticketY = y + 6;
      this._addTicketGrid(pdf, thirdPrize.tickets || [], rightX, ticketY, halfWidth, 1);
    }
    
    return y + 20;
  }

  // Add lower tier prize
  _addLowerTierPrize(pdf, prize, startY) {
    let y = startY;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    
    const prizeText = `${this._getPrizeLabel(prize.prize_type)} – Rs: ${this._formatCurrency(prize.prize_amount)}/-`;
    pdf.text(prizeText, this.margin, y);
    
    y += 6;
    
    // Get all ticket numbers
    const allNumbers = this._getAllTicketNumbers(prize);
    y = this._addTicketGrid(pdf, allNumbers, this.margin, y, this.contentWidth, 15, true);
    
    return y + 6;
  }

  // Add ticket grid
  _addTicketGrid(pdf, tickets, startX, startY, availableWidth, columns, isNumbersOnly = false) {
    if (!tickets || tickets.length === 0) return startY;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    
    const cellWidth = availableWidth / columns;
    const cellHeight = 8;
    let currentRow = 0;
    
    // Prepare ticket data
    const ticketData = isNumbersOnly ? 
      tickets.map(t => typeof t === 'string' ? t : t.toString()) :
      tickets.map(t => t.ticket_number ? `${t.ticket_number} (${t.location || 'N/A'})` : t.toString());
    
    // Draw grid
    for (let i = 0; i < ticketData.length; i++) {
      const col = i % columns;
      const row = Math.floor(i / columns);
      
      if (row > currentRow) {
        currentRow = row;
      }
      
      const x = startX + (col * cellWidth);
      const y = startY + (row * cellHeight);
      
      // Draw cell border
      pdf.setDrawColor(100, 100, 100);
      pdf.setLineWidth(0.2);
      pdf.rect(x, y - cellHeight + 2, cellWidth, cellHeight);
      
      // Add text centered in cell
      const text = this._sanitizeText(ticketData[i]);
      const textWidth = pdf.getTextWidth(text);
      const textX = x + (cellWidth - textWidth) / 2;
      const textY = y - 2;
      
      pdf.text(text, textX, textY);
    }
    
    return startY + ((currentRow + 1) * cellHeight);
  }

  // Add footer
  _addFooter(pdf) {
    const footerY = this.pageHeight - this.margin;
    
    // Divider line
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.2);
    pdf.line(this.margin, footerY - 15, this.pageWidth - this.margin, footerY - 15);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 100, 100);
    
    const footerText = 'The prize winners are advised to verify the winning numbers with the results published in the Kerala Government Gazette and surrender the winning tickets within 90 days.';
    const lines = pdf.splitTextToSize(footerText, this.contentWidth);
    
    pdf.text(lines, this.margin, footerY - 10, { align: 'center' });
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
  }

  // Helper methods
  _categorizePrizes(prizes) {
    const highTierTypes = ['1st', '2nd', '3rd'];
    const highTierPrizes = prizes.filter(p => 
      highTierTypes.includes(p.prize_type.toLowerCase())
    );
    
    const consolationPrize = prizes.find(p => 
      p.prize_type.toLowerCase().includes('consolation')
    );
    
    const lowerTierPrizes = prizes.filter(p => 
      !highTierTypes.includes(p.prize_type.toLowerCase()) && 
      !p.prize_type.toLowerCase().includes('consolation')
    );
    
    // Sort prizes
    const prizeOrder = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
    
    highTierPrizes.sort((a, b) => 
      prizeOrder.indexOf(a.prize_type.toLowerCase()) - 
      prizeOrder.indexOf(b.prize_type.toLowerCase())
    );
    
    lowerTierPrizes.sort((a, b) => 
      prizeOrder.indexOf(a.prize_type.toLowerCase()) - 
      prizeOrder.indexOf(b.prize_type.toLowerCase())
    );
    
    return { highTierPrizes, consolationPrize, lowerTierPrizes };
  }

  _getPrizeLabel(prizeType) {
    if (!prizeType) return 'Prize';
    
    const type = prizeType.toLowerCase();
    if (type.includes('1st') || type === '1st') return '1st Prize';
    if (type.includes('2nd') || type === '2nd') return '2nd Prize';
    if (type.includes('3rd') || type === '3rd') return '3rd Prize';
    if (type.includes('consolation')) return 'Consolation Prize';
    if (type.includes('4th')) return '4th Prize';
    if (type.includes('5th')) return '5th Prize';
    if (type.includes('6th')) return '6th Prize';
    if (type.includes('7th')) return '7th Prize';
    if (type.includes('8th')) return '8th Prize';
    
    return `${prizeType} Prize`;
  }

  _getAllTicketNumbers(prize) {
    if (prize.all_ticket_numbers) {
      return Array.isArray(prize.all_ticket_numbers) ? 
        prize.all_ticket_numbers : 
        prize.all_ticket_numbers.split(' ').filter(n => n.trim());
    }
    
    if (prize.ticket_numbers) {
      return Array.isArray(prize.ticket_numbers) ? 
        prize.ticket_numbers : 
        prize.ticket_numbers.split(' ').filter(n => n.trim());
    }
    
    if (prize.tickets) {
      return prize.tickets.map(t => t.ticket_number || t.toString());
    }
    
    return [];
  }

  _formatCurrency(amount) {
    if (!amount) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  _sanitizeText(text) {
    if (!text) return '';
    return text.toString().replace(/\s+/g, ' ').trim();
  }
}

// Usage example and integration with existing component
export const useLotteryPdf = () => {
  const pdfService = new LotteryPdfService();

  const downloadPdf = async (resultData) => {
    try {
      await pdfService.generateAndDownloadLotteryResult(resultData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const sharePdf = async (resultData) => {
    try {
      await pdfService.shareResultPdf(resultData);
    } catch (error) {
      console.error('Error sharing PDF:', error);
      // Fallback to download
      await downloadPdf(resultData);
    }
  };

  return { downloadPdf, sharePdf };
};

// Export the service for direct use
export default LotteryPdfService;