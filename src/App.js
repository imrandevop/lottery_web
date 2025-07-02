// App.js
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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
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

  // Handle window resize for responsive styles
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (windowWidth >= 992 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [windowWidth, isMobileMenuOpen]);

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

      {/* Home Section */}
      <section id="home">
        <Hero onDownloadApp={handleDownloadApp} isDarkMode={isDarkMode} />
      </section>

      {/* Results Section */}
      <section id="results">
        <main style={getStyles(isDarkMode).container}>
          <div style={getStyles(isDarkMode).mainContent}>
            <div data-section="sidebar">
              <Sidebar 
                lotteryDraws={lotteryDraws}
                selectedDraw={selectedDraw}
                loading={loading}
                error={error}
                onDrawClick={handleDrawClick}
                isDarkMode={isDarkMode}
              />
            </div>
            
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
      </section>

      {/* About Section */}
      <section id="about" style={getStyles(isDarkMode).aboutSection}>
        <div style={getStyles(isDarkMode).container}>
          <div style={getStyles(isDarkMode).aboutContent}>
            <h2 style={getStyles(isDarkMode).sectionTitle}>About LOTTO</h2>
            <div style={getStyles(isDarkMode).aboutGrid}>
              <div style={getStyles(isDarkMode).aboutCard}>
                <h3 style={getStyles(isDarkMode).cardTitle}>🎯 Instant Results</h3>
                <p style={getStyles(isDarkMode).cardText}>
                  Get Kerala lottery results instantly as soon as they're announced. 
                  No more waiting or searching multiple websites.
                </p>
              </div>
              <div style={getStyles(isDarkMode).aboutCard}>
                <h3 style={getStyles(isDarkMode).cardTitle}>📱 Mobile Friendly</h3>
                <p style={getStyles(isDarkMode).cardText}>
                  Access results on any device - mobile, tablet, or desktop. 
                  Download our app for the best experience.
                </p>
              </div>
              <div style={getStyles(isDarkMode).aboutCard}>
                <h3 style={getStyles(isDarkMode).cardTitle}>🔔 Notifications</h3>
                <p style={getStyles(isDarkMode).cardText}>
                  Never miss a draw! Get instant notifications when new results 
                  are available for your favorite lottery games.
                </p>
              </div>
              <div style={getStyles(isDarkMode).aboutCard}>
                <h3 style={getStyles(isDarkMode).cardTitle}>✅ Accurate Data</h3>
                <p style={getStyles(isDarkMode).cardText}>
                  All results are verified and updated directly from official sources. 
                  Trust our platform for reliable lottery information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={getStyles(isDarkMode).contactSection}>
        <div style={getStyles(isDarkMode).container}>
          <div style={getStyles(isDarkMode).contactContent}>
            <h2 style={getStyles(isDarkMode).sectionTitle}>Contact Us</h2>
            <div style={getStyles(isDarkMode).contactGrid}>
              <div style={getStyles(isDarkMode).contactInfo}>
                <h3 style={getStyles(isDarkMode).contactTitle}>Get in Touch</h3>
                <p style={getStyles(isDarkMode).contactText}>
                  Have questions about lottery results or need help with our app? 
                  We're here to help you 24/7.
                </p>
                <div style={getStyles(isDarkMode).contactDetails}>
                  <div style={getStyles(isDarkMode).contactItem}>
                    <span style={getStyles(isDarkMode).contactIcon}>📧</span>
                    <span>support@lotto-kerala.com</span>
                  </div>
                  <div style={getStyles(isDarkMode).contactItem}>
                    <span style={getStyles(isDarkMode).contactIcon}>📱</span>
                    <span>+91 9876543210</span>
                  </div>
                  <div style={getStyles(isDarkMode).contactItem}>
                    <span style={getStyles(isDarkMode).contactIcon}>⏰</span>
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>
              <div style={getStyles(isDarkMode).contactForm}>
                <h3 style={getStyles(isDarkMode).contactTitle}>Send Message</h3>
                <form style={getStyles(isDarkMode).form}>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    style={getStyles(isDarkMode).formInput}
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    style={getStyles(isDarkMode).formInput}
                  />
                  <textarea 
                    placeholder="Your Message" 
                    rows="4"
                    style={getStyles(isDarkMode).formTextarea}
                  ></textarea>
                  <button 
                    type="submit" 
                    style={getStyles(isDarkMode).formButton}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onDownloadApp={handleDownloadApp} isDarkMode={isDarkMode} />
    </div>
  );
}