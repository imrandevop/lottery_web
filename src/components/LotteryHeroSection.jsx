import React from 'react';

const LotteryHeroSection = ({ darkMode, selectedLottery, resultData, isMobile }) => {
  // Get today's date in Indian format
  const getTodayDate = () => {
    const today = new Date();
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      timeZone: 'Asia/Kolkata'
    };
    return today.toLocaleDateString('en-IN', options);
  };

  // Get lottery name for display
  const getLotteryDisplayName = () => {
    if (resultData && resultData.lottery_name) {
      return resultData.lottery_name;
    }
    if (selectedLottery && selectedLottery.lottery_name) {
      return selectedLottery.lottery_name;
    }
    return 'Monsoon Bumper Lottery BR.104';
  };

  // Get draw number if available
  const getDrawNumber = () => {
    if (resultData && resultData.draw_number) {
      return resultData.draw_number;
    }
    if (selectedLottery && selectedLottery.draw_number) {
      return selectedLottery.draw_number;
    }
    return 'BR.104';
  };

  return (
    <section style={{
      backgroundColor: darkMode ? '#121212' : '#FFF1F2',
      padding: isMobile ? '24px 20px' : '32px 20px',
      background: darkMode 
        ? 'linear-gradient(135deg, #121212 0%, #1E1E1E 50%, #121212 100%)'
        : 'linear-gradient(135deg, #FFF1F2 0%, #FFE8E8 50%, #FFF8F8 100%)',
      position: 'relative',
      overflow: 'hidden',
      borderBottom: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
      margin: '0 auto',
      transition: 'all 0.3s ease'
    }}>


      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        textAlign: 'center'
      }}>
        {/* Main Hero Title */}
        <h1 style={{
          color: darkMode ? '#FF6B6B' : '#D32F2F',
          fontSize: isMobile ? 'clamp(20px, 6vw, 28px)' : 'clamp(24px, 5vw, 40px)',
          fontWeight: 'bold',
          margin: '0 0 16px 0',
          lineHeight: '1.3',
          background: darkMode 
            ? 'linear-gradient(135deg, #FF6B6B, #FF8A80, #FFAB91)'
            : 'linear-gradient(135deg, #D32F2F, #FF5252, #FF7043)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: darkMode 
            ? '0 4px 20px rgba(255, 82, 82, 0.3)'
            : '0 4px 20px rgba(211, 47, 47, 0.25)',
          letterSpacing: '-0.5px'
        }}>
          Official Kerala Lottery {getTodayDate()}
          {isMobile ? <br /> : ' '}
          {getLotteryDisplayName()} Result Today
        </h1>

        {/* Status badges - only show bumper badge if applicable */}
        {resultData && resultData.is_bumper && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '25px',
              fontSize: '15px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'glow 2s ease-in-out infinite alternate',
              boxShadow: '0 6px 20px rgba(255, 82, 82, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ fontSize: '18px' }}>🎉</span>
              BUMPER SPECIAL
            </div>
          </div>
        )}

        {/* Subtitle */}
        <p style={{
          color: darkMode ? '#BDBDBD' : '#666',
          fontSize: 'clamp(14px, 2.5vw, 18px)',
          margin: '0',
          fontWeight: '500',
          opacity: 0.9,
          lineHeight: '1.5'
        }}>
          Kerala State Official Lottery Results • Updated Live • Verified Results
        </p>

        {/* Additional decorative line */}
        <div style={{
          width: '100px',
          height: '3px',
          background: darkMode 
            ? 'linear-gradient(90deg, transparent, #FF5252, transparent)'
            : 'linear-gradient(90deg, transparent, #D32F2F, transparent)',
          margin: '20px auto 0',
          borderRadius: '2px'
        }} />
      </div>

      <style>{`
        @keyframes glow {
          0% { box-shadow: 0 6px 20px rgba(255, 82, 82, 0.4); }
          100% { box-shadow: 0 8px 25px rgba(255, 82, 82, 0.6), 0 0 30px rgba(255, 82, 82, 0.3); }
        }
      `}</style>
    </section>
  );
};

export default LotteryHeroSection;