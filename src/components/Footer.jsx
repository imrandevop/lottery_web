// components/Footer.jsx
import React from 'react';

const Footer = ({ darkMode, isMobile }) => {
  return (
    <footer style={{
      backgroundColor: darkMode ? '#0D1117' : '#F8F9FA',
      padding: '40px 20px',
      marginTop: '40px',
      borderTop: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* About Section */}
          <div>
            <h3 style={{
              color: darkMode ? '#FF5252' : '#D32F2F',
              fontSize: '18px',
              marginBottom: '16px',
              fontWeight: 'bold'
            }}>
              Kerala Lottery Results
            </h3>
            <p style={{
              color: darkMode ? '#BDBDBD' : '#666',
              fontSize: '14px',
              lineHeight: '1.6',
              margin: '0'
            }}>
              Get the latest Kerala State Lottery results instantly. Check winning numbers for all Kerala lotteries including daily draws and bumper lotteries. Official Kerala Lottery results published by the Government of Kerala.
            </p>
          </div>

          {/* Popular Lotteries */}
          <div>
            <h3 style={{
              color: darkMode ? '#FF5252' : '#D32F2F',
              fontSize: '18px',
              marginBottom: '16px',
              fontWeight: 'bold'
            }}>
              Popular Lotteries
            </h3>
            <div style={{
              color: darkMode ? '#BDBDBD' : '#666',
              fontSize: '14px',
              lineHeight: '1.8'
            }}>
              <div>Win Win Lottery</div>
              <div>Sthree Sakthi Lottery</div>
              <div>Akshaya Lottery</div>
              <div>Karunya Plus Lottery</div>
              <div>Nirmal Lottery</div>
              <div>Karunya Lottery</div>
              <div>Pournami Lottery</div>
            </div>
          </div>

          {/* Bumper Lotteries */}
          <div>
            <h3 style={{
              color: darkMode ? '#FF5252' : '#D32F2F',
              fontSize: '18px',
              marginBottom: '16px',
              fontWeight: 'bold'
            }}>
              Bumper Lotteries
            </h3>
            <div style={{
              color: darkMode ? '#BDBDBD' : '#666',
              fontSize: '14px',
              lineHeight: '1.8'
            }}>
              <div>Onam Bumper</div>
              <div>Christmas New Year Bumper</div>
              <div>Vishu Bumper</div>
              <div>Thiruvonam Bumper</div>
              <div>Pooja Bumper</div>
              <div>Summer Bumper</div>
            </div>
          </div>
        </div>

        {/* SEO Keywords Section */}
        <div style={{
          backgroundColor: darkMode ? '#1A1A1A' : '#FFFFFF',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
        }}>
          <h4 style={{
            color: darkMode ? '#FF5252' : '#D32F2F',
            fontSize: '16px',
            marginBottom: '12px',
            fontWeight: 'bold'
          }}>
            Kerala Lottery Information
          </h4>
          <div style={{
            color: darkMode ? '#BDBDBD' : '#666',
            fontSize: '13px',
            lineHeight: '1.5'
          }}>
            Kerala Lottery Results Today Live | Kerala State Lottery Results | Daily Lottery Results | 
            Lottery Draw Time | Prize Money Structure | Winning Numbers Check | Kerala Government Lottery | 
            Official Lottery Results | First Prize Second Prize Third Prize | Consolation Prize | 
            Agent Commission | Lottery Ticket Price | Draw Schedule | Result Publication | 
            Prize Claim Process | Lucky Numbers | Lottery Winners | Today Result | 
            Live Draw | Online Result Check | Mobile App | Fast Results
          </div>
        </div>

        {/* Links */}
        <div style={{
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '16px'
          }}>
            <a 
              href="https://lotto-app-f3440.web.app/privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: darkMode ? '#FF5252' : '#D32F2F',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Privacy Policy
            </a>
            <span style={{ color: darkMode ? '#424242' : '#E0E0E0' }}>|</span>
            <a 
              href="https://lotto-app-f3440.web.app/terms-conditions.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: darkMode ? '#FF5252' : '#D32F2F',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Terms & Conditions
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          color: darkMode ? '#BDBDBD' : '#666',
          fontSize: '14px'
        }}>
          <p style={{ margin: '0' }}>
            © 2025 LOTTO - Kerala Lottery Results. All results are for informational purposes only. 
            Please verify with official Kerala State Lottery Department.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;