// hooks/usePrintPDF.js
import { useState } from 'react';
import { generatePDF } from '../utils/pdfGenerator';        // Keep original name
import { createPrintContent } from '../utils/printUtils';   // Keep original name

export const usePrintPDF = (resultData, darkMode, isMobile) => {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const handlePrint = () => {
    if (!resultData) return;

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    
    if (isMobileDevice) {
      handleMobilePDFGeneration();
    } else {
      handleDesktopPrint();
    }
  };

  const handleMobilePDFGeneration = async () => {
    setPdfLoading(true);
    setPdfError('');
    
    try {
      await generatePDF(resultData, darkMode);  // Uses your updated pdfGenerator.js
      setPdfError('✅ PDF downloaded successfully!');
      setTimeout(() => setPdfError(''), 4000);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setPdfError(`❌ PDF generation failed: ${error.message}. Please try again.`);
      setTimeout(() => setPdfError(''), 5000);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDesktopPrint = () => {
    const printContent = createPrintContent(resultData, darkMode);  // Uses your updated printUtils.js
    openPrintWindow(printContent);
  };

  const openPrintWindow = (printContent) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      setPdfError('Please allow popups to print the lottery results.');
      setTimeout(() => setPdfError(''), 3000);
    }
  };

  return {
    handlePrint,
    pdfLoading,
    pdfError
  };
};