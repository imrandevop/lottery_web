// File: lottery-app/src/styles/styles.js
// Dynamic styles function that returns different styles based on theme and screen size
export const getStyles = (isDarkMode) => {
  // Get current window width for responsive calculations
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  
  // Responsive breakpoints
  const isExtraSmall = width <= 575.98;
  const isSmall = width >= 576 && width <= 767.98;
  const isMedium = width >= 768 && width <= 991.98;
  const isLarge = width >= 992 && width <= 1199.98;
  const isExtraLarge = width >= 1200;
  const isMobile = width <= 767.98;
  const isTablet = width >= 768 && width <= 991.98;
  const isDesktop = width >= 992;

  return {
    app: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: isExtraSmall ? '14px' : isSmall ? '15px' : '16px'
    },
    
    // Navigation
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
      padding: isExtraSmall ? '0 15px' : '0 20px',
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
      fontSize: isExtraSmall ? '20px' : 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 'bold',
      margin: 0,
      letterSpacing: '2px',
      color: isDarkMode ? '#FF0000' : '#FFFFFF',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      userSelect: 'none'
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
      marginLeft: '15px',
      minHeight: isMobile ? '44px' : '40px',
      minWidth: isMobile ? '44px' : '40px',
      transition: 'all 0.3s ease'
    },
    
    // Mobile Menu Button
    mobileMenuButton: {
      display: isMedium || isMobile ? 'block' : 'none',
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: isExtraSmall ? '18px' : '20px',
      cursor: 'pointer',
      padding: isExtraSmall ? '8px' : '10px',
      borderRadius: '4px',
      transition: 'background-color 0.3s ease',
      minHeight: '44px',
      minWidth: '44px'
    },
    
    // Navigation Links
    navLinks: {
      display: isMedium || isMobile ? 'none' : 'flex',
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
      borderRadius: '20px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      minHeight: isMobile ? '44px' : 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    
    // Mobile Navigation
    mobileNavMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: isDarkMode ? '#121212' : '#FF0000',
      display: 'flex',
      flexDirection: 'column',
      padding: '15px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 1000,
      borderTop: `1px solid ${isDarkMode ? '#424242' : 'rgba(255,255,255,0.2)'}`
    },
    mobileNavLink: {
      color: 'white',
      textDecoration: 'none',
      padding: '12px 15px',
      marginBottom: '8px',
      fontSize: '16px',
      borderRadius: '6px',
      transition: 'background-color 0.3s ease',
      cursor: 'pointer',
      textAlign: 'left',
      border: 'none',
      background: 'transparent',
      display: 'block',
      width: '100%'
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
      cursor: 'pointer',
      minHeight: isMobile ? '44px' : 'auto',
      minWidth: isMobile ? '44px' : 'auto',
      transition: 'all 0.3s ease'
    },
    mobileDownloadButton: {
      backgroundColor: 'white',
      color: '#FF0000',
      border: 'none',
      padding: '12px 15px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px',
      marginBottom: '8px',
      textAlign: 'left',
      width: '100%',
      transition: 'background-color 0.3s ease'
    },
    mobileThemeToggle: {
      backgroundColor: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'white',
      padding: '12px 15px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      textAlign: 'left',
      width: '100%',
      transition: 'background-color 0.3s ease'
    },
    
    // Hero Section
    hero: {
      background: '#FF0000',
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
    
    // About Section
    aboutSection: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      padding: 'clamp(40px, 8vh, 80px) 0',
      transition: 'background-color 0.3s ease'
    },
    aboutContent: {
      textAlign: 'center'
    },
    aboutGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: 'clamp(20px, 4vw, 30px)',
      marginTop: '40px'
    },
    aboutCard: {
      backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
      padding: 'clamp(25px, 5vw, 35px)',
      borderRadius: '15px',
      textAlign: 'center',
      boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    
    // Contact Section
    contactSection: {
      backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
      padding: 'clamp(40px, 8vh, 80px) 0',
      transition: 'background-color 0.3s ease'
    },
    contactContent: {
      textAlign: 'center'
    },
    contactGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: 'clamp(30px, 6vw, 50px)',
      marginTop: '40px',
      textAlign: 'left'
    },
    contactInfo: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      padding: 'clamp(25px, 5vw, 35px)',
      borderRadius: '15px',
      boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'
    },
    contactForm: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      padding: 'clamp(25px, 5vw, 35px)',
      borderRadius: '15px',
      boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'
    },
    contactDetails: {
      marginTop: '20px'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '15px 0',
      fontSize: '16px',
      color: isDarkMode ? '#E0E0E0' : '#666666'
    },
    contactIcon: {
      fontSize: '20px'
    },
    
    // Form Styles
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    formInput: {
      padding: '12px 15px',
      borderRadius: '8px',
      border: isDarkMode ? '2px solid #424242' : '2px solid #e9ecef',
      backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: '16px',
      transition: 'border-color 0.3s ease'
    },
    formTextarea: {
      padding: '12px 15px',
      borderRadius: '8px',
      border: isDarkMode ? '2px solid #424242' : '2px solid #e9ecef',
      backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontSize: '16px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'border-color 0.3s ease'
    },
    formButton: {
      backgroundColor: '#FF0000',
      color: 'white',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    
    // Section Titles
    sectionTitle: {
      fontSize: 'clamp(2rem, 5vw, 2.5rem)',
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: '20px',
      transition: 'color 0.3s ease'
    },
    cardTitle: {
      fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: '15px',
      transition: 'color 0.3s ease'
    },
    cardText: {
      fontSize: 'clamp(14px, 2.5vw, 16px)',
      color: isDarkMode ? '#E0E0E0' : '#666666',
      lineHeight: '1.6',
      transition: 'color 0.3s ease'
    },
    contactTitle: {
      fontSize: 'clamp(1.3rem, 3.5vw, 1.5rem)',
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: '15px',
      transition: 'color 0.3s ease'
    },
    contactText: {
      fontSize: 'clamp(14px, 2.5vw, 16px)',
      color: isDarkMode ? '#E0E0E0' : '#666666',
      lineHeight: '1.6',
      transition: 'color 0.3s ease'
    },
    
    // Main Container
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isExtraSmall ? '10px' : isSmall ? '15px' : isTablet ? '20px' : isLarge ? '25px' : '30px'
    },
    mainContent: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isExtraSmall ? '15px' : isSmall ? '18px' : 'clamp(15px, 3vw, 30px)',
      minHeight: '600px',
      maxWidth: isLarge ? '1140px' : isExtraLarge ? '1200px' : '100%',
      margin: isDesktop ? '0 auto' : '0'
    },
    
    // Sidebar
    sidebar: {
      flex: isMobile ? '1' : isTablet ? '0 0 35%' : isLarge ? '0 0 30%' : isExtraLarge ? '0 0 25%' : '1',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: '15px',
      boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      maxHeight: isExtraSmall ? '40vh' : isSmall ? '45vh' : isMobile ? '50vh' : isTablet ? '70vh' : isLarge ? '75vh' : '80vh',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      order: isMobile ? 2 : 'initial',
      marginBottom: isExtraSmall ? '15px' : 0,
      minWidth: isTablet ? '280px' : 'auto',
      overflowY: isMobile ? 'auto' : 'hidden'
    },
    sidebarHeader: {
      backgroundColor: '#FF0000',
      padding: isExtraSmall ? '12px 15px' : 'clamp(15px, 3vw, 20px)',
      color: 'white'
    },
    sidebarTitle: {
      margin: 0,
      fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
      fontWeight: '600'
    },
    drawsList: {
      maxHeight: isExtraSmall ? 'calc(40vh - 60px)' : isSmall ? 'calc(45vh - 70px)' : isMobile ? 'calc(50vh - 80px)' : 'calc(80vh - 80px)',
      overflowY: 'auto',
      padding: '10px',
      scrollbarWidth: isMobile ? 'thin' : 'auto'
    },
    drawCard: {
      padding: isExtraSmall ? '12px' : 'clamp(12px, 2.5vw, 16px)',
      margin: isExtraSmall ? '8px' : '8px',
      backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid transparent',
      color: isDarkMode ? '#E0E0E0' : '#000000',
      minHeight: isMobile ? '44px' : 'auto',
      display: isMobile ? 'flex' : 'block',
      alignItems: isMobile ? 'center' : 'stretch',
      marginBottom: isExtraSmall ? '8px' : '8px'
    },
    selectedDrawCard: {
      backgroundColor: isDarkMode ? '#2A1F1F' : '#FFE8EA',
      border: '2px solid #FF0000',
      transform: isMobile ? 'none' : 'translateX(5px)',
      boxShadow: '0 5px 15px rgba(255, 0, 0, 0.4)',
      borderLeft: isMobile ? '4px solid #FF0000' : '2px solid #FF0000'
    },
    drawCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: isExtraSmall ? 'flex-start' : 'center',
      marginBottom: '8px',
      flexDirection: isExtraSmall ? 'column' : 'row',
      gap: isExtraSmall ? '4px' : 0
    },
    drawDate: {
      fontSize: 'clamp(11px, 2vw, 13px)',
      fontWeight: '500',
      color: isDarkMode ? '#BDBDBD' : '#666666'
    },
    drawNumber: {
      fontSize: 'clamp(10px, 1.8vw, 12px)',
      backgroundColor: '#FF0000',
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
      flex: isMobile ? '1' : isTablet ? '1' : '2.5',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      borderRadius: '15px',
      boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      order: isMobile ? 1 : 'initial'
    },
    resultsContainer: {
      height: '100%'
    },
    resultsHeader: {
      backgroundColor: '#FF0000',
      padding: isExtraSmall ? '15px' : 'clamp(20px, 4vw, 25px)',
      color: 'white'
    },
    resultsTitle: {
      margin: '0 0 10px 0',
      fontSize: isExtraSmall ? '20px' : isSmall ? '22px' : 'clamp(1.3rem, 3.5vw, 1.8rem)',
      fontWeight: 'bold'
    },
    resultsInfo: {
      display: 'flex',
      flexDirection: isExtraSmall ? 'column' : 'row',
      gap: isExtraSmall ? '5px' : '20px',
      fontSize: 'clamp(12px, 2.5vw, 14px)',
      opacity: 0.9,
      flexWrap: 'wrap',
      alignItems: isExtraSmall ? 'flex-start' : 'center'
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
      marginBottom: isExtraSmall ? '15px' : 'clamp(20px, 4vw, 25px)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: isDarkMode ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.3s ease'
    },
    prizeHeader: {
      padding: isExtraSmall ? '12px 15px' : 'clamp(12px, 3vw, 15px) clamp(15px, 4vw, 20px)',
      color: 'white'
    },
    prizeTitle: {
      margin: 0,
      fontSize: isExtraSmall ? '16px' : 'clamp(1rem, 2.8vw, 1.2rem)',
      fontWeight: 'bold'
    },
    prizeContent: {
      padding: 'clamp(15px, 4vw, 20px)',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      transition: 'background-color 0.3s ease'
    },
    prizeAmount: {
      fontSize: isExtraSmall ? '20px' : isSmall ? '22px' : 'clamp(1.3rem, 4vw, 1.8rem)',
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      marginBottom: '20px',
      textAlign: 'center',
      transition: 'color 0.3s ease',
      padding: isExtraSmall ? '15px' : 'initial'
    },
    croreText: {
      fontSize: 'clamp(0.8rem, 2.2vw, 1rem)',
      color: isDarkMode ? '#BDBDBD' : '#666666',
      fontWeight: 'normal'
    },
    
    // Tickets
    ticketsContainer: {
      display: 'grid',
      gridTemplateColumns: isMedium ? 'repeat(2, 1fr)' : isLarge ? 'repeat(2, 1fr)' : isExtraLarge ? 'repeat(3, 1fr)' : '1fr',
      gap: '15px'
    },
    ticketCard: {
      backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
      padding: isExtraSmall ? '10px' : 'clamp(15px, 3.5vw, 20px)',
      borderRadius: '12px',
      border: isDarkMode ? '2px solid #424242' : '2px solid #e9ecef',
      textAlign: 'center',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      minHeight: isExtraSmall ? '60px' : isMobile ? '44px' : 'auto',
      display: isMobile ? 'flex' : 'block',
      alignItems: isMobile ? 'center' : 'stretch'
    },
    ticketNumber: {
      fontSize: isExtraSmall ? '16px' : 'clamp(1.2rem, 3.5vw, 1.5rem)',
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
      gridTemplateColumns: isExtraSmall ? 'repeat(2, 1fr)' : 
                          isSmall ? 'repeat(3, 1fr)' : 
                          isMedium ? 'repeat(4, 1fr)' : 
                          isLarge ? 'repeat(5, 1fr)' : 
                          'repeat(6, 1fr)',
      gap: isExtraSmall ? '8px' : 'clamp(8px, 2vw, 12px)'
    },
    consolationTicket: {
      backgroundColor: isDarkMode ? '#121212' : '#FFF1F2',
      padding: isExtraSmall ? '8px' : 'clamp(10px, 2.5vw, 12px)',
      borderRadius: '8px',
      textAlign: 'center',
      fontSize: isExtraSmall ? '14px' : 'clamp(12px, 2.2vw, 14px)',
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
      border: isDarkMode ? '1px solid #424242' : '1px solid #e9ecef',
      transition: 'all 0.3s ease',
      minHeight: isMobile ? '44px' : 'auto',
      display: isMobile ? 'flex' : 'block',
      alignItems: isMobile ? 'center' : 'stretch',
      justifyContent: isMobile ? 'center' : 'initial'
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
      backgroundColor: '#FF0000',
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
      borderTop: '4px solid #FF0000',
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
      backgroundColor: '#FF0000',
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
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: isMobile ? '25px' : isTablet ? '30px' : 'clamp(25px, 5vw, 40px)',
      padding: isMobile ? '20px 15px' : '0'
    },
    footerSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      textAlign: isMobile ? 'center' : 'left'
    },
    footerTitle: {
      fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
      fontWeight: 'bold',
      color: '#FF0000',
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
      backgroundColor: '#FF0000',
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
  };
};