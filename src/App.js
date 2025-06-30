import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import ResultsArea from './components/ResultsArea';
import Footer from './components/Footer';
import { getStyles } from './styles/styles';
import { useTheme } from './hooks/useTheme';
import { useLotteryData } from './hooks/useLotteryData';
import './styles/global.css';

export default function App() {
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Custom hooks
  const { isDarkMode, toggleTheme } = useTheme();
  const { 
    lotteryDraws, 
    selectedResults, 
    loading, 
    resultsLoading, 
    error, 
    fetchDrawResults 
  } = useLotteryData();

  // Handle when a draw is selected
  const handleDrawClick = (draw) => {
    setSelectedDraw(draw);
    fetchDrawResults(draw.unique_id);
  };

  // Handle app download
  const handleDownloadApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.open('https://apps.apple.com/app/your-lottery-app', '_blank');
    } else if (/android/i.test(userAgent)) {
      window.open('https://play.google.com/store/apps/details?id=your.lottery.app', '_blank');
    } else {
      alert('Download our mobile app:\n\niOS: Search "LOTTO" on App Store\nAndroid: Search "LOTTO" on Google Play Store');
    }
  };

  return (
    <div style={getStyles(isDarkMode).app}>
      {/* SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "LOTTO - Kerala Lottery Results",
          "url": window.location.origin,
          "description": "Get latest Kerala lottery results instantly. Check winning numbers, prize amounts, and ticket details.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      <Navbar 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onDownloadApp={handleDownloadApp}
      />

      <Hero onDownloadApp={handleDownloadApp} isDarkMode={isDarkMode} />

      <main style={getStyles(isDarkMode).container}>
        <div style={getStyles(isDarkMode).mainContent}>
          <Sidebar 
            lotteryDraws={lotteryDraws}
            selectedDraw={selectedDraw}
            loading={loading}
            error={error}
            onDrawClick={handleDrawClick}
            isDarkMode={isDarkMode}
          />
          
          <ResultsArea 
            selectedDraw={selectedDraw}
            selectedResults={selectedResults}
            resultsLoading={resultsLoading}
            error={error}
            onDownloadApp={handleDownloadApp}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>

      <Footer onDownloadApp={handleDownloadApp} isDarkMode={isDarkMode} />
    </div>
  );
}