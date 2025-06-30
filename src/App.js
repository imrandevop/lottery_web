import React, { useState, useEffect } from 'react';

export default function App() {
  // State management
  const [lotteryDraws, setLotteryDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [selectedResults, setSelectedResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // API Base URL
  const API_BASE_URL = 'https://lottery-app-5bve.onrender.com/api/results';
  
  // Initialize theme based on system preference and localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Fetch all lottery draws when component loads
  useEffect(() => {
    fetchAllDraws();
    
    // Set page title and meta description for SEO
    document.title = 'LOTTO - Kerala Lottery Results | Live Updates & Winners';
    
    // Add meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Get latest Kerala lottery results instantly. Check winning numbers, prize amounts, and ticket details for all Kerala state lotteries including Karunya, Win-Win, Sthree Sakthi, and more.';
    
    // Add keywords meta tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = 'Kerala lottery, lottery results, lottery winning numbers, Kerala state lottery, Karunya lottery, Win-Win lottery, lottery prizes, lottery tickets';
    
    // Add viewport meta tag for mobile responsiveness
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    viewport.content = 'width=device-width, initial-scale=1.0';
    
  }, []);
  
  // Function to fetch all available draws
  const fetchAllDraws = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/results/`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const sortedDraws = data.results.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLotteryDraws(sortedDraws);
      } else {
        setError('Failed to fetch lottery draws');
      }
    } catch (err) {
      setError('Network error: Unable to fetch lottery draws');
      console.error('Error fetching draws:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch detailed results for a specific draw
  const fetchDrawResults = async (uniqueId) => {
    try {
      setResultsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/get-by-unique-id/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unique_id: uniqueId
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setSelectedResults(data.result);
        // Update page title with selected lottery name for better SEO
        document.title = `${data.result.lottery_name} Results - ${formatShortDate(data.result.date)} | LOTTO`;
      } else {
        setError('Failed to fetch detailed results');
      }
    } catch (err) {
      setError('Network error: Unable to fetch results');
      console.error('Error fetching results:', err);
    } finally {
      setResultsLoading(false);
    }
  };
  
  // Handle when a draw is selected
  const handleDrawClick = (draw) => {
    setSelectedDraw(draw);
    fetchDrawResults(draw.unique_id);
  };
  
  // Format date for display (used in SEO title updates)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format short date
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Get prize background color
  const getPrizeColor = (prizeType) => {
    const baseColor = '#FF0000'; // Pure red, no shading
    switch(prizeType.toLowerCase()) {
      case '1st': return baseColor;
      case 'consolation': return baseColor;
      case '2nd': return baseColor; // Same pure red
      case '3rd': return baseColor; // Same pure red
      default: return baseColor; // Same pure red
    }
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
  
  // Render prize section
  const renderPrizeSection = (prize) => {
    const backgroundColor = getPrizeColor(prize.prize_type);
    
    return (
      <div key={prize.prize_type} style={getStyles(isDarkMode).prizeSection}>
        <div style={{...getStyles(isDarkMode).prizeHeader, backgroundColor}}>
          <h3 style={getStyles(isDarkMode).prizeTitle}>
            {prize.prize_type === '1st' ? '1st Prize' : 
             prize.prize_type === 'consolation' ? 'Consolation Prize' :
             prize.prize_type === '2nd' ? '2nd Prize' :
             prize.prize_type === '3rd' ? '3rd Prize' :
             `${prize.prize_type} Prize`}
          </h3>
        </div>
        
        <div style={getStyles(isDarkMode).prizeContent}>
          <div style={getStyles(isDarkMode).prizeAmount}>
            {formatCurrency(prize.prize_amount)}
            {prize.prize_type === '1st' && <span style={getStyles(isDarkMode).croreText}> [1 Crore]</span>}
          </div>
          
          {prize.tickets && prize.tickets.length > 0 ? (
            <div style={getStyles(isDarkMode).ticketsContainer}>
              {prize.tickets.map((ticket, index) => (
                <div key={index} style={getStyles(isDarkMode).ticketCard}>
                  <div style={getStyles(isDarkMode).ticketNumber}>{ticket.ticket_number}</div>
                  {ticket.location && (
                    <div style={getStyles(isDarkMode).ticketLocation}>📍 {ticket.location}</div>
                  )}
                </div>
              ))}
            </div>
          ) : prize.ticket_numbers ? (
            <div style={getStyles(isDarkMode).consolationGrid}>
              {prize.ticket_numbers.split(' ').map((number, index) => (
                <div key={index} style={getStyles(isDarkMode).consolationTicket}>
                  {number}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
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

      {/* Navigation Bar */}
      <nav style={getStyles(isDarkMode).navbar}>
        <div style={getStyles(isDarkMode).navContainer}>
          <div style={getStyles(isDarkMode).logo}>
            <h1 style={getStyles(isDarkMode).logoText}>LOTTO</h1>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            style={getStyles(isDarkMode).mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
          
          {/* Desktop Navigation */}
          <div style={getStyles(isDarkMode).navLinks}>
            <a href="#home" style={getStyles(isDarkMode).navLink}>Home</a>
            <a href="#results" style={getStyles(isDarkMode).navLink}>Results</a>
            <a href="#about" style={getStyles(isDarkMode).navLink}>About</a>
            <a href="#contact" style={getStyles(isDarkMode).navLink}>Contact</a>
            <button style={getStyles(isDarkMode).downloadButton} onClick={handleDownloadApp}>
              📱 Download App
            </button>
            
            {/* Theme Toggle Button - Moved after download button */}
            <button 
              style={getStyles(isDarkMode).themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div style={getStyles(isDarkMode).mobileNavMenu}>
              <a href="#home" style={getStyles(isDarkMode).mobileNavLink}>Home</a>
              <a href="#results" style={getStyles(isDarkMode).mobileNavLink}>Results</a>
              <a href="#about" style={getStyles(isDarkMode).mobileNavLink}>About</a>
              <a href="#contact" style={getStyles(isDarkMode).mobileNavLink}>Contact</a>
              <button style={getStyles(isDarkMode).mobileDownloadButton} onClick={handleDownloadApp}>
                📱 Download App
              </button>
              
              {/* Theme Toggle in Mobile Menu */}
              <button 
                style={getStyles(isDarkMode).mobileThemeToggle}
                onClick={toggleTheme}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header style={getStyles(isDarkMode).hero}>
        <div style={getStyles(isDarkMode).heroContent}>
          <h1 style={getStyles(isDarkMode).heroTitle}>Kerala Lottery Results</h1>
          <p style={getStyles(isDarkMode).heroSubtitle}>Get the latest lottery results instantly</p>
          <button style={getStyles(isDarkMode).heroDownloadButton} onClick={handleDownloadApp}>
            📱 Download Mobile App
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={getStyles(isDarkMode).container}>
        <div style={getStyles(isDarkMode).mainContent}>
          {/* Left Sidebar - Recent Draws */}
          <aside style={getStyles(isDarkMode).sidebar}>
            <div style={getStyles(isDarkMode).sidebarHeader}>
              <h2 style={getStyles(isDarkMode).sidebarTitle}>Recent Draws</h2>
            </div>
            
            {loading ? (
              <div style={getStyles(isDarkMode).loadingCard}>
                <div style={getStyles(isDarkMode).loadingSpinner}></div>
                <p style={getStyles(isDarkMode).loadingText}>Loading draws...</p>
              </div>
            ) : error ? (
              <div style={getStyles(isDarkMode).errorCard}>
                <p style={getStyles(isDarkMode).errorText}>{error}</p>
                <button style={getStyles(isDarkMode).retryButton} onClick={fetchAllDraws}>
                  Retry
                </button>
              </div>
            ) : (
              <div style={getStyles(isDarkMode).drawsList}>
                {lotteryDraws.map((draw) => (
                  <article
                    key={draw.unique_id}
                    style={{
                      ...getStyles(isDarkMode).drawCard,
                      ...(selectedDraw?.unique_id === draw.unique_id ? getStyles(isDarkMode).selectedDrawCard : {})
                    }}
                    onClick={() => handleDrawClick(draw)}
                  >
                    <div style={getStyles(isDarkMode).drawCardHeader}>
                      <time style={getStyles(isDarkMode).drawDate}>{formatShortDate(draw.date)}</time>
                      <span style={getStyles(isDarkMode).drawNumber}>#{draw.draw_number}</span>
                    </div>
                    <h3 style={getStyles(isDarkMode).drawName}>{draw.lottery_name}</h3>
                    <div style={getStyles(isDarkMode).drawPrize}>
                      First Prize: {formatCurrency(draw.first_prize.amount)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </aside>
          
          {/* Right Content - Results */}
          <section style={getStyles(isDarkMode).resultsArea}>
            {selectedDraw ? (
              <div style={getStyles(isDarkMode).resultsContainer}>
                {/* Results Header */}
                <header style={getStyles(isDarkMode).resultsHeader}>
                  <h2 style={getStyles(isDarkMode).resultsTitle}>{selectedDraw.lottery_name}</h2>
                  <div style={getStyles(isDarkMode).resultsInfo}>
                    <time style={getStyles(isDarkMode).resultsDate}>📅 {formatShortDate(selectedDraw.date)}</time>
                    <span style={getStyles(isDarkMode).resultsDrawNumber}>#{selectedDraw.draw_number}</span>
                  </div>
                </header>
                
                {resultsLoading ? (
                  <div style={getStyles(isDarkMode).loadingCard}>
                    <div style={getStyles(isDarkMode).loadingSpinner}></div>
                    <p style={getStyles(isDarkMode).loadingText}>Loading detailed results...</p>
                  </div>
                ) : error ? (
                  <div style={getStyles(isDarkMode).errorCard}>
                    <p style={getStyles(isDarkMode).errorText}>{error}</p>
                  </div>
                ) : selectedResults ? (
                  <div style={getStyles(isDarkMode).prizesContainer}>
                    {selectedResults.prizes.map((prize) => renderPrizeSection(prize))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div style={getStyles(isDarkMode).welcomeCard}>
                <div style={getStyles(isDarkMode).welcomeIcon}>🎰</div>
                <h2 style={getStyles(isDarkMode).welcomeTitle}>Welcome to LOTTO</h2>
                <p style={getStyles(isDarkMode).welcomeText}>
                  Select a lottery draw from the sidebar to view detailed results
                </p>
                <button style={getStyles(isDarkMode).welcomeDownloadButton} onClick={handleDownloadApp}>
                  📱 Get Mobile App
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer style={getStyles(isDarkMode).footer}>
        <div style={getStyles(isDarkMode).footerContainer}>
          <div style={getStyles(isDarkMode).footerSection}>
            <h3 style={getStyles(isDarkMode).footerTitle}>LOTTO</h3>
            <p style={getStyles(isDarkMode).footerText}>Your trusted source for Kerala lottery results. Get instant updates on winning numbers, prize amounts, and ticket details.</p>
            <button style={getStyles(isDarkMode).footerDownloadButton} onClick={handleDownloadApp}>
              📱 Download Mobile App
            </button>
          </div>
          <div style={getStyles(isDarkMode).footerSection}>
            <h4 style={getStyles(isDarkMode).footerSubtitle}>Quick Links</h4>
            <a href="#home" style={getStyles(isDarkMode).footerLink}>Home</a>
            <a href="#results" style={getStyles(isDarkMode).footerLink}>Latest Results</a>
            <a href="#about" style={getStyles(isDarkMode).footerLink}>About Us</a>
            <a href="#winners" style={getStyles(isDarkMode).footerLink}>Recent Winners</a>
          </div>
          <div style={getStyles(isDarkMode).footerSection}>
            <h4 style={getStyles(isDarkMode).footerSubtitle}>Lottery Types</h4>
            <a href="#karunya" style={getStyles(isDarkMode).footerLink}>Karunya</a>
            <a href="#winwin" style={getStyles(isDarkMode).footerLink}>Win-Win</a>
            <a href="#sthreesakthi" style={getStyles(isDarkMode).footerLink}>Sthree Sakthi</a>
            <a href="#bhagyathara" style={getStyles(isDarkMode).footerLink}>Bhagyathara</a>
          </div>
          <div style={getStyles(isDarkMode).footerSection}>
            <h4 style={getStyles(isDarkMode).footerSubtitle}>Support</h4>
            <a href="#contact" style={getStyles(isDarkMode).footerLink}>Contact Us</a>
            <a href="#help" style={getStyles(isDarkMode).footerLink}>Help Center</a>
            <a href="#faq" style={getStyles(isDarkMode).footerLink}>FAQ</a>
            <a href="#terms" style={getStyles(isDarkMode).footerLink}>Terms & Conditions</a>
          </div>
        </div>
        <div style={getStyles(isDarkMode).footerBottom}>
          <p style={getStyles(isDarkMode).copyright}>© 2025 LOTTO. All rights reserved. | Kerala State Lottery Results</p>
        </div>
      </footer>
    </div>
  );
}

// Dynamic styles function that returns different styles based on theme
const getStyles = (isDarkMode) => ({
  app: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
    color: isDarkMode ? '#FFFFFF' : '#000000'
  },
  
  // Navigation - Updated with Flutter colors
  navbar: {
    backgroundColor: isDarkMode ? '#121212' : '#FF0000',
    boxShadow: '0 2px 20px rgba(255, 0, 0, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
    position: 'relative'
  },
  logo: {
    color: 'white'
  },
  logoText: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 'bold',
    margin: 0,
    letterSpacing: '2px',
    color: isDarkMode ? '#FF0000' : '#FFFFFF'
  },
  
  // Theme Toggle Button
  themeToggle: {
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    marginLeft: '15px' // Add margin to separate from download button
  },
  
  // Mobile Menu Button
  mobileMenuButton: {
    display: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  
  // Desktop Navigation
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    padding: '8px 16px',
    borderRadius: '20px'
  },
  
  // Mobile Navigation Menu
  mobileNavMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? '#121212' : '#FF0000',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },
  mobileNavLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    fontSize: '16px'
  },
  
  // Download Buttons
  downloadButton: {
    backgroundColor: 'white',
    color: '#FF0000',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  mobileDownloadButton: {
    backgroundColor: 'white',
    color: '#FF0000',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px'
  },
  
  // Mobile Theme Toggle Button
  mobileThemeToggle: {
    backgroundColor: 'transparent',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  
  // Hero Section
  hero: {
    background: '#FF0000', // Pure solid red, no gradient
    color: 'white',
    padding: 'clamp(40px, 8vh, 80px) 20px',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    lineHeight: '1.2'
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 3vw, 1.3rem)',
    opacity: 0.9,
    margin: '0 0 30px 0',
    lineHeight: '1.5'
  },
  heroDownloadButton: {
    backgroundColor: 'white',
    color: '#FF0000',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '25px',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  
  // Main Container
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: 'clamp(20px, 5vw, 40px)'
  },
  mainContent: {
    display: 'flex',
    gap: 'clamp(15px, 3vw, 30px)',
    minHeight: '600px'
  },
  
  // Sidebar
  sidebar: {
    flex: '1',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', // Flutter card colors
    borderRadius: '15px',
    boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    maxHeight: '80vh',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
  },
  sidebarHeader: {
    backgroundColor: '#FF0000', // Pure red
    padding: 'clamp(15px, 3vw, 20px)',
    color: 'white'
  },
  sidebarTitle: {
    margin: 0,
    fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
    fontWeight: '600'
  },
  drawsList: {
    maxHeight: 'calc(80vh - 80px)',
    overflowY: 'auto',
    padding: '10px'
  },
  drawCard: {
    padding: 'clamp(12px, 2.5vw, 16px)',
    margin: '8px',
    backgroundColor: isDarkMode ? '#121212' : '#FFF1F2', // Flutter scaffold colors
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    color: isDarkMode ? '#E0E0E0' : '#000000'
  },
  selectedDrawCard: {
    backgroundColor: isDarkMode ? '#2A1F1F' : '#FFE8EA',
    border: '2px solid #FF0000', // Pure red border
    transform: 'translateX(5px)',
    boxShadow: '0 5px 15px rgba(255, 0, 0, 0.4)' // Stronger red shadow
  },
  drawCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  drawDate: {
    fontSize: 'clamp(11px, 2vw, 13px)',
    fontWeight: '500',
    color: isDarkMode ? '#BDBDBD' : '#666666'
  },
  drawNumber: {
    fontSize: 'clamp(10px, 1.8vw, 12px)',
    backgroundColor: '#FF0000', // Same FF0000 for both modes
    color: 'white',
    padding: '2px 8px',
    borderRadius: '10px'
  },
  drawName: {
    margin: '0 0 8px 0',
    fontSize: 'clamp(12px, 2.2vw, 14px)',
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#000000'
  },
  drawPrize: {
    fontSize: 'clamp(10px, 2vw, 12px)',
    color: isDarkMode ? '#BDBDBD' : '#666666',
    fontWeight: '500'
  },
  
  // Results Area
  resultsArea: {
    flex: '2.5',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: '15px',
    boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
  },
  resultsContainer: {
    height: '100%'
  },
  resultsHeader: {
    backgroundColor: '#FF0000', // Pure red
    padding: 'clamp(20px, 4vw, 25px)',
    color: 'white'
  },
  resultsTitle: {
    margin: '0 0 10px 0',
    fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
    fontWeight: 'bold'
  },
  resultsInfo: {
    display: 'flex',
    gap: '20px',
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    opacity: 0.9,
    flexWrap: 'wrap'
  },
  resultsDate: {
    fontWeight: '500'
  },
  resultsDrawNumber: {
    fontWeight: '500'
  },
  
  // Prizes
  prizesContainer: {
    padding: 'clamp(15px, 3vw, 20px)',
    maxHeight: 'calc(80vh - 120px)',
    overflowY: 'auto'
  },
  prizeSection: {
    marginBottom: 'clamp(20px, 4vw, 25px)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: isDarkMode ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'box-shadow 0.3s ease'
  },
  prizeHeader: {
    padding: 'clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)',
    color: 'white'
  },
  prizeTitle: {
    margin: 0,
    fontSize: 'clamp(1rem, 2.8vw, 1.2rem)',
    fontWeight: 'bold'
  },
  prizeContent: {
    padding: 'clamp(15px, 4vw, 20px)',
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    transition: 'background-color 0.3s ease'
  },
  prizeAmount: {
    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#000000',
    marginBottom: '20px',
    textAlign: 'center',
    transition: 'color 0.3s ease'
  },
  croreText: {
    fontSize: 'clamp(0.8rem, 2.2vw, 1rem)',
    color: isDarkMode ? '#BDBDBD' : '#666666',
    fontWeight: 'normal'
  },
  
  // Tickets
  ticketsContainer: {
    display: 'grid',
    gap: '15px'
  },
  ticketCard: {
    backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
    padding: 'clamp(15px, 3.5vw, 20px)',
    borderRadius: '12px',
    border: isDarkMode ? '2px solid #424242' : '2px solid #e9ecef',
    textAlign: 'center',
    transition: 'background-color 0.3s ease, border-color 0.3s ease'
  },
  ticketNumber: {
    fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#000000',
    marginBottom: '8px',
    letterSpacing: '1px',
    transition: 'color 0.3s ease'
  },
  ticketLocation: {
    fontSize: 'clamp(12px, 2.5vw, 14px)',
    color: isDarkMode ? '#BDBDBD' : '#666666',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  },
  
  // Consolation tickets
  consolationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 'clamp(8px, 2vw, 12px)'
  },
  consolationTicket: {
    backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
    padding: 'clamp(10px, 2.5vw, 12px)',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: 'clamp(12px, 2.2vw, 14px)',
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#000000',
    border: isDarkMode ? '1px solid #424242' : '1px solid #e9ecef',
    transition: 'all 0.3s ease'
  },
  
  // Welcome screen
  welcomeCard: {
    padding: 'clamp(40px, 8vw, 60px) clamp(20px, 5vw, 40px)',
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcomeIcon: {
    fontSize: 'clamp(3rem, 8vw, 4rem)',
    marginBottom: '20px'
  },
  welcomeTitle: {
    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
    fontWeight: 'bold',
    color: isDarkMode ? '#FFFFFF' : '#000000',
    marginBottom: '15px',
    transition: 'color 0.3s ease'
  },
  welcomeText: {
    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
    color: isDarkMode ? '#E0E0E0' : '#666666',
    lineHeight: '1.6',
    maxWidth: '400px',
    marginBottom: '25px',
    transition: 'color 0.3s ease'
  },
  welcomeDownloadButton: {
    backgroundColor: '#FF0000', // Pure red
    color: 'white',
    border: 'none',
    padding: 'clamp(12px, 3vw, 15px) clamp(20px, 5vw, 30px)',
    borderRadius: '25px',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  
  // Loading and Error states
  loadingCard: {
    padding: 'clamp(30px, 6vw, 40px)',
    textAlign: 'center'
  },
  loadingSpinner: {
    width: 'clamp(30px, 6vw, 40px)',
    height: 'clamp(30px, 6vw, 40px)',
    border: isDarkMode ? '4px solid #424242' : '4px solid #f3f3f3',
    borderTop: '4px solid #FF0000', // Pure red
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px auto'
  },
  loadingText: {
    color: isDarkMode ? '#E0E0E0' : '#666666',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    transition: 'color 0.3s ease'
  },
  errorCard: {
    padding: 'clamp(30px, 6vw, 40px)',
    textAlign: 'center'
  },
  errorText: {
    color: isDarkMode ? '#FF7575' : '#dc3545',
    fontSize: 'clamp(14px, 2.5vw, 16px)',
    marginBottom: '20px',
    transition: 'color 0.3s ease'
  },
  retryButton: {
    backgroundColor: '#FF0000', // Pure red
    color: 'white',
    border: 'none',
    padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)',
    borderRadius: '8px',
    fontSize: 'clamp(12px, 2.2vw, 14px)',
    fontWeight: '500',
    cursor: 'pointer'
  },
  
  // Footer
  footer: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#2c3e50',
    color: 'white',
    padding: 'clamp(30px, 6vw, 50px) clamp(15px, 4vw, 20px) 20px',
    transition: 'background-color 0.3s ease'
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 'clamp(25px, 5vw, 40px)'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  footerTitle: {
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    fontWeight: 'bold',
    color: '#FF0000', // Pure red
    margin: 0
  },
  footerSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
    fontWeight: '600',
    margin: 0,
    color: isDarkMode ? '#E0E0E0' : '#ecf0f1',
    transition: 'color 0.3s ease'
  },
  footerText: {
    color: isDarkMode ? '#BDBDBD' : '#bdc3c7',
    lineHeight: '1.6',
    margin: 0,
    fontSize: 'clamp(13px, 2.2vw, 14px)',
    transition: 'color 0.3s ease'
  },
  footerLink: {
    color: isDarkMode ? '#BDBDBD' : '#bdc3c7',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    fontSize: 'clamp(13px, 2.2vw, 14px)',
    padding: '2px 0'
  },
  footerDownloadButton: {
    backgroundColor: '#FF0000', // Pure red
    color: 'white',
    border: 'none',
    padding: 'clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 20px)',
    borderRadius: '8px',
    fontSize: 'clamp(12px, 2.2vw, 14px)',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'flex-start'
  },
  footerBottom: {
    borderTop: isDarkMode ? '1px solid #424242' : '1px solid #34495e',
    marginTop: 'clamp(30px, 6vw, 40px)',
    paddingTop: '20px',
    textAlign: 'center',
    transition: 'border-color 0.3s ease'
  },
  copyright: {
    color: isDarkMode ? '#BDBDBD' : '#95a5a6',
    fontSize: 'clamp(12px, 2vw, 14px)',
    margin: 0,
    lineHeight: '1.5',
    transition: 'color 0.3s ease'
  }
});

// Add CSS for animations and responsive styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Mobile Navigation Styles */
    @media (max-width: 768px) {
      .nav-links {
        display: none !important;
      }
      
      .mobile-menu-button {
        display: block !important;
      }
      
      .main-content {
        flex-direction: column !important;
        gap: 20px !important;
      }
      
      .sidebar {
        max-height: 50vh !important;
        order: 2 !important;
      }
      
      .results-area {
        order: 1 !important;
      }
      
      .selected-draw-card {
        transform: none !important;
      }
    }
    
    /* Responsive Grid Adjustments */
    @media (max-width: 480px) {
      .consolation-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
      
      .footer-container {
        grid-template-columns: 1fr !important;
        gap: 30px !important;
      }
    }
    
    /* Hover Effects */
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .download-button:hover,
    .hero-download-button:hover,
    .welcome-download-button:hover,
    .footer-download-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }
    
    .theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: scale(1.1);
    }
    
    .draw-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .footer-link:hover {
      color: var(--primary-color) !important;
    }
    
    .ticket-card:hover,
    .consolation-ticket:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    /* Focus Styles for Accessibility */
    button:focus,
    a:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    
    /* Smooth Scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--primary-color);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--primary-color-hover);
    }
    
    /* CSS Variables for Dynamic Theming */
    .dark {
      --primary-color: #FF0000;
      --primary-color-hover: #FF0000;
      --background-color: #121212;
      --surface-color: #1E1E1E;
      --text-primary: #FFFFFF;
      --text-secondary: #E0E0E0;
      --text-tertiary: #BDBDBD;
      --border-color: #424242;
      --scrollbar-track: #424242;
    }
    
    :root {
      --primary-color: #FF0000;
      --primary-color-hover: #FF0000;
      --background-color: #FFF1F2;
      --surface-color: #FFFFFF;
      --text-primary: #000000;
      --text-secondary: #000000DE;
      --text-tertiary: #00000099;
      --border-color: #e9ecef;
      --scrollbar-track: #f1f1f1;
    }
    
    /* Remove ALL transitions that could cause color dimming */
    * {
      transition: none !important;
    }
    
    /* Ensure red colors stay pure and vibrant */
    .pure-red {
      background-color: #FF0000 !important;
      color: #FF0000 !important;
    }
    
    /* Override any opacity or color changes on scroll */
    .navbar,
    .hero,
    .sidebar-header,
    .results-header,
    .prize-header {
      opacity: 1 !important;
      filter: none !important;
    }
    
    /* Print Styles */
    @media print {
      .navbar,
      .footer,
      .theme-toggle,
      .download-button,
      .hero-download-button,
      .welcome-download-button,
      .footer-download-button {
        display: none !important;
      }
      
      .app {
        background-color: white !important;
        color: black !important;
      }
      
      .sidebar,
      .results-area {
        box-shadow: none !important;
        border: 1px solid #ccc !important;
      }
    }
    
    /* Reduced Motion for Accessibility */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    /* High Contrast Mode Support */
    @media (prefers-contrast: high) {
      .draw-card,
      .ticket-card,
      .consolation-ticket {
        border-width: 2px !important;
      }
    }
  `;

  document.head.appendChild(styleSheet);
}