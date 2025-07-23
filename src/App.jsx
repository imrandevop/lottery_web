// App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LotteryList from './components/LotteryList';
import PrizeResults from './components/PrizeResults';
import Footer from './components/Footer';
import DownloadPopup from './components/DownloadPopup';
import { useResponsive } from './hooks/useResponsive';
import { useLotteryData } from './hooks/useLotteryData';
import { useLotteryPdf } from './services/LotteryPdfService'; // Use the working PDF service
import LotteryHeroSection from './components/LotteryHeroSection';


const KeralaLotteryApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  
  const { isMobile } = useResponsive();
  const {
    lotteryResults,
    selectedLottery,
    resultData,
    loading,
    listLoading,
    error,
    handleLotterySelect,
    refetchLotteryList
  } = useLotteryData();
  
  // Use the working PDF service instead of usePrintPDF
  const { downloadPdf, sharePdf } = useLotteryPdf();

  // Simple print handler that works for both mobile and desktop
  const handlePrint = async () => {
    if (!resultData) return;
    
    try {
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent);
      
      if (isMobileDevice) {
        // For mobile: try to share, fallback to download
        try {
          await sharePdf(resultData);
        } catch (shareError) {
          console.log('Share failed, falling back to download');
          await downloadPdf(resultData);
        }
      } else {
        // For desktop: use browser print
        window.print();
      }
    } catch (error) {
      console.error('Print operation failed:', error);
      // Last resort: try PDF download
      try {
        await downloadPdf(resultData);
      } catch (pdfError) {
        console.error('PDF generation also failed:', pdfError);
      }
    }
  };

  // Download popup timer
  useEffect(() => {
    const initialTimer = setTimeout(() => setShowDownloadPopup(true), 5000);
    const intervalTimer = setInterval(() => setShowDownloadPopup(true), 300000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);
  const handleLotteryItemClick = (lottery) => {
    handleLotterySelect(lottery);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#0A0A0A' : '#E8E8E8',
      padding: '10px',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        minHeight: 'calc(100vh - 20px)',
        backgroundColor: darkMode ? '#121212' : '#FFF1F2',
        color: darkMode ? '#E0E0E0' : '#333',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          onMenuToggle={handleMobileMenuToggle}
        />
        <LotteryHeroSection 
        darkMode={darkMode}
        selectedLottery={selectedLottery}
        resultData={resultData}
        isMobile={isMobile}
        />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          minHeight: 'calc(100vh - 100px)'
        }}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside style={{
              width: '320px',
              backgroundColor: darkMode ? '#1E1E1E' : 'white',
              marginTop: '20px',
              marginLeft: '10px',
              marginRight: '10px',
              borderRadius: '8px',
              overflowY: 'auto',
              height: 'fit-content'
            }}>
              <div style={{ padding: '20px' }}>
                <LotteryList
                  lotteryResults={lotteryResults}
                  listLoading={listLoading}
                  selectedId={selectedLottery?.unique_id}
                  onItemClick={handleLotteryItemClick}
                  darkMode={darkMode}
                />
              </div>
            </aside>
          )}

          {/* Mobile Menu Overlay */}
          {isMobile && mobileMenuOpen && (
            <div style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 200
            }}>
              <div style={{
                width: '300px',
                height: '100%',
                backgroundColor: darkMode ? '#1E1E1E' : 'white',
                padding: '20px',
                overflowY: 'auto'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h2 style={{
                    color: darkMode ? '#FF5252' : '#D32F2F',
                    fontSize: '18px',
                    margin: '0',
                    fontWeight: 'bold'
                  }}>
                    Results
                  </h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: darkMode ? '#E0E0E0' : '#333',
                      fontSize: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <LotteryList
                  lotteryResults={lotteryResults}
                  listLoading={listLoading}
                  selectedId={selectedLottery?.unique_id}
                  onItemClick={handleLotteryItemClick}
                  darkMode={darkMode}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main style={{
            flex: 1,
            padding: '20px',
            paddingTop: '20px',
            overflow: 'auto'
          }}>
            <PrizeResults
              selectedLottery={selectedLottery}
              resultData={resultData}
              loading={loading}
              error={error}
              darkMode={darkMode}
              isMobile={isMobile}
              onRetry={() => handleLotterySelect(selectedLottery)}
              onPrint={handlePrint}
            />
          </main>
        </div>

        <Footer darkMode={darkMode} isMobile={isMobile} />

        <DownloadPopup
          show={showDownloadPopup}
          onClose={() => setShowDownloadPopup(false)}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default KeralaLotteryApp;