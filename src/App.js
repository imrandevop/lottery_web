import React, { useState, useEffect } from 'react';

const KeralaLotteryApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLottery, setSelectedLottery] = useState(null);
  const [lotteryResults, setLotteryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch lottery list on component mount
  useEffect(() => {
    fetchLotteryList();
  }, []);

  // Download popup timer
  useEffect(() => {
    // Show popup after 5 seconds initially
    const initialTimer = setTimeout(() => {
      setShowDownloadPopup(true);
    }, 5000);

    // Then show every 5 minutes
    const intervalTimer = setInterval(() => {
      setShowDownloadPopup(true);
    }, 300000); // 5 minutes = 300000ms

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const fetchLotteryList = async () => {
    setListLoading(true);
    try {
      const response = await fetch('https://sea-lion-app-begbw.ondigitalocean.app/api/results/results/');
      
      if (!response.ok) {
        throw new Error('Failed to fetch lottery list');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.results) {
        setLotteryResults(data.results);
        
        // Auto-select the latest (first) lottery result
        if (data.results.length > 0) {
          const latestLottery = data.results[0];
          setSelectedLottery(latestLottery);
          fetchLotteryResult(latestLottery.unique_id);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to load lottery list. Please try again.');
      console.error('Error fetching lottery list:', err);
    } finally {
      setListLoading(false);
    }
  };

  const fetchLotteryResult = async (uniqueId) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://sea-lion-app-begbw.ondigitalocean.app/api/results/get-by-unique-id/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unique_id: uniqueId })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lottery result');
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.result) {
        setResultData(data.result);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to load lottery result. Please try again.');
      console.error('Error fetching lottery result:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLotterySelect = (lottery) => {
    setSelectedLottery(lottery);
    setMobileMenuOpen(false);
    fetchLotteryResult(lottery.unique_id);
  };

  const handlePrint = () => {
    // Add print-specific styles
    const printStyles = `
      <style>
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          
          @page {
            size: A4 portrait !important;
            margin: 4mm !important;
          }
          
          body {
            font-family: Arial, sans-serif !important;
            background: white !important;
            color: black !important;
            font-size: 16px !important;
            line-height: 1.1 !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          .print-container {
            width: 100% !important;
            height: 100% !important;
            border: 3px solid #000 !important;
            background: white !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .print-header {
            background: #e0e0e0 !important;
            padding: 4px 8px !important;
            border-bottom: 3px solid #000 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-weight: bold !important;
            font-size: 16px !important;
            flex-shrink: 0 !important;
          }
          
          .print-title {
            font-size: 18px !important;
            font-weight: bold !important;
            text-align: center !important;
            flex: 1 !important;
          }
          
          .print-content {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .print-prize-section {
            border-bottom: 1px solid #000 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .print-prize-header {
            background: #d0d0d0 !important;
            padding: 2px 6px !important;
            border-bottom: 1px solid #000 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-weight: bold !important;
            flex-shrink: 0 !important;
          }
          
          .print-prize-title {
            font-size: 13px !important;
            color: #000 !important;
          }
          
          .print-prize-amount {
            font-size: 11px !important;
            color: #000 !important;
            background: #f5f5f5 !important;
            padding: 1px 4px !important;
            border: 1px solid #999 !important;
            border-radius: 2px !important;
          }
          
          .print-numbers-section {
            padding: 1px 3px !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .print-numbers-grid {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 2px !important;
            justify-content: flex-start !important;
            width: 100% !important;
          }
          
          .print-number {
            border: 1px solid #666 !important;
            padding: 3px 5px !important;
            text-align: center !important;
            font-family: monospace !important;
            font-weight: bold !important;
            background: white !important;
            font-size: 13px !important;
            min-width: 48px !important;
            height: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
          }
          
          .print-number-large {
            border: 2px solid #666 !important;
            padding: 3px 6px !important;
            text-align: center !important;
            font-family: monospace !important;
            font-weight: bold !important;
            background: white !important;
            font-size: 13px !important;
            margin: 0 auto !important;
            display: block !important;
            width: fit-content !important;
          }
          
          .print-footer-text {
            padding: 2px 6px !important;
            font-size: 8px !important;
            text-align: justify !important;
            line-height: 1.1 !important;
            border-top: 2px solid #000 !important;
            flex-shrink: 0 !important;
          }
          
          /* Hide everything except print content */
          body > *:not(.print-only) {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          /* Special styling for single number prizes */
          .single-number-prize .print-numbers-section {
            justify-content: center !important;
          }
          
          /* Compact for many numbers */
          .many-numbers .print-number {
            min-width: 44px !important;
            font-size: 11px !important;
            height: 18px !important;
          }
          
          .many-numbers .print-numbers-grid {
            gap: 1px !important;
          }
          
          /* Medium size for moderate numbers */
          .medium-numbers .print-number {
            min-width: 46px !important;
            font-size: 12px !important;
            height: 19px !important;
          }
        }
      </style>
    `;
    
    // Create print content
    if (resultData) {
      const printWindow = window.open('', '_blank');
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resultData.lottery_name} - ${formatDate(resultData.date)}</title>
          <meta charset="UTF-8">
          ${printStyles}
        </head>
        <body>
          <div class="print-only print-container">
            <div class="print-header">
              <span>${resultData.draw_number || 'KN-XXX'}</span>
              <span class="print-title">${resultData.lottery_name}</span>
              <span>${formatDate(resultData.date)}</span>
            </div>
            
            <div class="print-content">
              ${resultData.prizes?.map((prize, index) => {
                const ticketNumbers = prize.tickets ? 
                  prize.tickets.map(t => t.ticket_number) : 
                  prize.ticket_numbers.split(' ');
                
                const isSingleNumber = ticketNumbers.length === 1;
                const isManyNumbers = ticketNumbers.length > 100;
                const isMediumNumbers = ticketNumbers.length > 20 && ticketNumbers.length <= 100;
                
                const prizeClass = isSingleNumber ? 'single-number-prize' : 
                                  isManyNumbers ? 'many-numbers' : 
                                  isMediumNumbers ? 'medium-numbers' : '';
                
                return `
                <div class="print-prize-section ${prizeClass}">
                  ${isSingleNumber ? 
                    `<div class="print-numbers-section">
                       <div style="text-align: center;">
                         <div style="font-size: 11px; font-weight: bold; margin-bottom: 2px;">
                           ${prize.prize_type === '1st' ? '1st Prize' :
                             prize.prize_type === '2nd' ? '2nd Prize' :
                             prize.prize_type === '3rd' ? '3rd Prize' :
                             prize.prize_type === 'consolation' ? 'Consolation Prize' :
                             prize.prize_type.includes('സമാധാനം') ? 'Consolation Prize' :
                             `${prize.prize_type} Prize`} - ₹${formatCurrency(prize.prize_amount)}/-
                         </div>
                         <div class="print-number-large">${ticketNumbers[0]}</div>
                         ${prize.tickets && prize.tickets[0].location ? 
                           `<div style="text-align: center; font-size: 9px; margin-top: 2px;">(${prize.tickets[0].location})</div>` : ''}
                       </div>
                     </div>` :
                    `<div class="print-prize-header">
                       <span class="print-prize-title">
                         ${prize.prize_type === '1st' ? '1st Prize' :
                           prize.prize_type === '2nd' ? '2nd Prize' :
                           prize.prize_type === '3rd' ? '3rd Prize' :
                           prize.prize_type === 'consolation' ? 'Consolation Prize' :
                           prize.prize_type.includes('സമാധാനം') ? 'Consolation Prize' :
                           `${prize.prize_type} Prize`}
                       </span>
                       <span class="print-prize-amount">
                         ₹${formatCurrency(prize.prize_amount)}/-
                       </span>
                     </div>
                     
                     <div class="print-numbers-section">
                       <div class="print-numbers-grid">
                         ${ticketNumbers.map(num => `<div class="print-number">${num}</div>`).join('')}
                       </div>
                     </div>`
                  }
                </div>
              `;}).join('') || ''}
            </div>
            
            <div class="print-footer-text">
              ഈ ഫലങ്ങൾ ഔദ്യോഗികമായി പ്രസിദ്ധീകരിച്ചതിനനുസരിച്ച് എഴുതിയതാണ്. പവിത്രമായ സംഖ്യകളുടെ സാധുതയും ശ്രദ്ധിക്കുക. സാക്ഷികളുടെ സാന്നിധ്യത്തിലാണ് സമ്മാനം നൽകുന്നത്. നിയമാനുസൃതമായ രേഖകളുണ്ടായിരിക്കണം. ഒറിജിനൽ ടിക്കറ്റ് 30 ദിവസത്തിനുള്ളിൽ ഹാജരാക്കണം.
            </div>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-IN');
  };

  const renderPrizeResults = () => {
    if (!resultData?.prizes) return null;

    return (
      <div style={{ marginTop: '20px' }}>
        {resultData.prizes.map((prize, index) => (
          <div
            key={index}
            style={{
              backgroundColor: darkMode ? '#1E1E1E' : 'white',
              borderRadius: '12px',
              marginBottom: '16px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
          >
            {/* Prize Header */}
            <div style={{
              backgroundColor: '#FF5252',
              color: 'white',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <h3 style={{
                margin: '0',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                {prize.prize_type === '1st' ? '1st Prize' :
                 prize.prize_type === '2nd' ? '2nd Prize' :
                 prize.prize_type === '3rd' ? '3rd Prize' :
                 prize.prize_type === 'consolation' ? 'Consolation Prize' :
                 `${prize.prize_type} Prize`}
              </h3>
            </div>

            {/* Prize Amount */}
            <div style={{
              backgroundColor: darkMode ? '#2A2A2A' : '#F5F5F5',
              padding: '12px 16px',
              textAlign: 'center',
              borderBottom: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
            }}>
              <span style={{
                color: darkMode ? '#E0E0E0' : '#333',
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                ₹{formatCurrency(prize.prize_amount)}/-
              </span>
            </div>
            
            {/* Ticket Numbers */}
            <div style={{ padding: '16px' }}>
              {prize.tickets ? (
                <div>
                  {prize.tickets.map((ticket, ticketIndex) => (
                    <div key={ticketIndex} style={{ 
                      marginBottom: '12px',
                      padding: '16px',
                      backgroundColor: darkMode ? '#2A2A2A' : '#F8F8F8',
                      borderRadius: '8px',
                      border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
                      textAlign: 'center'
                    }}>
                      <div style={{
                        color: darkMode ? '#E0E0E0' : '#333',
                        fontSize: isMobile ? '24px' : '20px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        marginBottom: '8px'
                      }}>
                        {ticket.ticket_number}
                      </div>
                      {ticket.location && (
                        <div style={{
                          color: darkMode ? '#BDBDBD' : '#666',
                          fontSize: '14px'
                        }}>
                          📍 {ticket.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                (() => {
                  const ticketNumbers = prize.ticket_numbers.split(' ');
                  const hasMultipleTickets = ticketNumbers.length > 1;
                  
                  if (hasMultipleTickets) {
                    // Check if it's 4th to 10th prize (usually has many small ticket numbers)
                    const isSmallPrize = prize.prize_type && (
                      prize.prize_type.includes('4th') || 
                      prize.prize_type.includes('5th') || 
                      prize.prize_type.includes('6th') || 
                      prize.prize_type.includes('7th') || 
                      prize.prize_type.includes('8th') || 
                      prize.prize_type.includes('9th') || 
                      prize.prize_type.includes('10th')
                    ) && !prize.prize_type.includes('consolation');
                    
                    return (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isSmallPrize ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                        gap: '12px'
                      }}>
                        {ticketNumbers.map((ticket, ticketIndex) => (
                          <div
                            key={ticketIndex}
                            style={{
                              backgroundColor: darkMode ? '#2A2A2A' : '#F8F8F8',
                              color: darkMode ? '#E0E0E0' : '#333',
                              padding: isSmallPrize ? '12px 8px' : '16px 12px',
                              borderRadius: '8px',
                              textAlign: 'center',
                              fontSize: isSmallPrize ? (isMobile ? '18px' : '16px') : (isMobile ? '20px' : '18px'),
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                              border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
                              minHeight: isSmallPrize ? '40px' : '50px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {ticket}
                          </div>
                        ))}
                      </div>
                    );
                  } else {
                    return (
                      <div style={{
                        backgroundColor: darkMode ? '#2A2A2A' : '#F8F8F8',
                        padding: '20px',
                        borderRadius: '8px',
                        color: darkMode ? '#E0E0E0' : '#333',
                        fontSize: isMobile ? '24px' : '20px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
                      }}>
                        {prize.ticket_numbers}
                      </div>
                    );
                  }
                })()
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const LotteryList = ({ onItemClick, selectedId }) => (
    <div>
      
      {listLoading ? (
        <div style={{
          color: darkMode ? '#BDBDBD' : '#666',
          textAlign: 'center',
          padding: '20px'
        }}>
          Loading...
        </div>
      ) : (
        lotteryResults.map((lottery) => (
          <div
            key={lottery.unique_id}
            onClick={() => onItemClick(lottery)}
            style={{
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: selectedId === lottery.unique_id 
                ? (darkMode ? '#FF5252' : '#D32F2F') 
                : 'transparent',
              color: selectedId === lottery.unique_id 
                ? 'white' 
                : (darkMode ? '#E0E0E0' : '#333'),
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {lottery.lottery_name}
            </div>
            <div style={{ 
              fontSize: '14px', 
              opacity: 0.8,
              marginTop: '4px'
            }}>
              {formatDate(lottery.date)}
            </div>
            <div style={{ 
              fontSize: '13px', 
              opacity: 0.7,
              marginTop: '2px'
            }}>
              Draw: {lottery.draw_number}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const Footer = () => (
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#121212' : '#FFF1F2',
      color: darkMode ? '#E0E0E0' : '#333',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease'
    }}>
      {/* SEO Meta Tags - Hidden */}
      <div style={{ display: 'none' }}>
        Kerala Lottery Results Today Live, LOTTO, Lottery Results Kerala, 
        Kerala State Lottery, Win Win Lottery, Akshaya Lottery, Sthree Sakthi Lottery,
        Karunya Lottery, Nirmal Lottery, Pournami Lottery, Kerala Government Lottery,
        Lottery Result Check, Prize Money, Winning Numbers, Daily Lottery Results,
        Kerala Lottery Draw, Bumper Lottery, Thiruvonam Bumper, Christmas Bumper,
        Onam Bumper, Vishu Bumper, Kerala Lottery Official, State Lottery Results
      </div>

      {/* Header */}
      <header style={{
        backgroundColor: darkMode ? '#121212' : '#FFF1F2',
        padding: '16px 20px',
        borderBottom: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: darkMode ? '#E0E0E0' : '#333',
                  fontSize: '24px',
                  marginRight: '16px',
                  cursor: 'pointer'
                }}
              >
                ☰
              </button>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{
                color: darkMode ? '#FF5252' : '#D32F2F',
                margin: '0',
                fontSize: isMobile ? '18px' : '22px',
                fontWeight: 'bold'
              }}>
                LOTTO
              </h1>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.3s ease'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside style={{
            width: '320px',
            backgroundColor: darkMode ? '#1E1E1E' : 'white',
            padding: '20px',
            borderRight: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
            overflowY: 'auto'
          }}>
            <LotteryList 
              onItemClick={handleLotterySelect} 
              selectedId={selectedLottery?.unique_id} 
            />
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
                onItemClick={handleLotterySelect} 
                selectedId={selectedLottery?.unique_id} 
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto'
        }}>
          {!selectedLottery ? (
            <div style={{
              textAlign: 'center',
              marginTop: '40px'
            }}>
              <h2 style={{
                color: darkMode ? '#E0E0E0' : '#666',
                fontSize: '24px',
                marginBottom: '16px'
              }}>
                Select a Lottery
              </h2>
              <p style={{
                color: darkMode ? '#BDBDBD' : '#888',
                fontSize: '16px'
              }}>
                {isMobile ? 'Tap the menu button to select a lottery' : 'Choose a lottery from the sidebar to view results'}
              </p>
            </div>
          ) : loading ? (
            <div style={{
              textAlign: 'center',
              marginTop: '40px'
            }}>
              <div style={{
                color: darkMode ? '#FF5252' : '#D32F2F',
                fontSize: '18px'
              }}>
                Loading result...
              </div>
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center',
              marginTop: '40px',
              color: '#f44336',
              fontSize: '16px'
            }}>
              {error}
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={() => fetchLotteryResult(selectedLottery?.unique_id)}
                  style={{
                    backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : resultData ? (
            <div>
              {/* Result Header */}
              <div style={{
                backgroundColor: darkMode ? '#1E1E1E' : 'white',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: darkMode ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h1 style={{
                  color: darkMode ? '#FF5252' : '#D32F2F',
                  fontSize: isMobile ? '24px' : '28px',
                  margin: '0 0 8px 0',
                  fontWeight: 'bold'
                }}>
                  {resultData.lottery_name}
                </h1>
                
                <div style={{
                  color: darkMode ? '#BDBDBD' : '#666',
                  fontSize: '16px',
                  marginBottom: '4px'
                }}>
                  Draw Number: {resultData.draw_number}
                </div>
                <div style={{
                  color: darkMode ? '#BDBDBD' : '#666',
                  fontSize: '16px',
                  marginBottom: '16px'
                }}>
                  Date: {formatDate(resultData.date)}
                </div>

                {/* Action Buttons - Moved below draw number and date */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  marginBottom: '8px',
                  flexWrap: 'wrap'
                }}>
                  {/* Print Button */}
                  <button
                    onClick={handlePrint}
                    style={{
                      backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flex: isMobile ? '1' : 'none',
                      justifyContent: 'center'
                    }}
                  >
                    🖨️ Print
                  </button>
                  
                  {/* Download App Button */}
                  <button
                    onClick={() => {/* Add download logic here */}}
                    style={{
                      backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flex: isMobile ? '1' : 'none',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Download App
                  </button>
                </div>

                {resultData.is_bumper && (
                  <div style={{
                    backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline-block'
                  }}>
                    BUMPER
                  </div>
                )}
              </div>

              {/* Prize Results */}
              {renderPrizeResults()}
            </div>
          ) : null}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Download App Popup */}
      {showDownloadPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#1E1E1E' : 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '300px',
            margin: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              color: darkMode ? '#FF5252' : '#D32F2F',
              margin: '0 0 16px 0',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              Get Our App!
            </h3>
            <p style={{
              color: darkMode ? '#E0E0E0' : '#333',
              margin: '0 0 20px 0',
              fontSize: '16px'
            }}>
              Download our app for faster results and notifications
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {/* Add download logic here */}}
                style={{
                  backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Download App
              </button>
              <button
                onClick={() => setShowDownloadPopup(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: darkMode ? '#BDBDBD' : '#666',
                  border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeralaLotteryApp;