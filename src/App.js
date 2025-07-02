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
              border: `1px solid ${darkMode ? '#424242' : '#E0E0E0'}`,
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{
                color: darkMode ? '#FF5252' : '#D32F2F',
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
              <span style={{
                color: darkMode ? '#4CAF50' : '#2E7D32',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                ₹{formatCurrency(prize.prize_amount)}
              </span>
            </div>
            
            {prize.tickets ? (
              <div>
                {prize.tickets.map((ticket, ticketIndex) => (
                  <div key={ticketIndex} style={{ 
                    marginBottom: '8px',
                    padding: '8px',
                    backgroundColor: darkMode ? '#2A2A2A' : '#F5F5F5',
                    borderRadius: '6px'
                  }}>
                    <div style={{
                      color: darkMode ? '#E0E0E0' : '#333',
                      fontSize: '18px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      marginBottom: '4px'
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
                  return (
                    <div style={{
                      backgroundColor: darkMode ? '#2A2A2A' : '#F5F5F5',
                      padding: '12px',
                      borderRadius: '6px'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                        gap: '8px'
                      }}>
                        {ticketNumbers.map((ticket, ticketIndex) => (
                          <div
                            key={ticketIndex}
                            style={{
                              backgroundColor: darkMode ? '#3A3A3A' : 'white',
                              color: darkMode ? '#E0E0E0' : '#333',
                              padding: '8px 4px',
                              borderRadius: '4px',
                              textAlign: 'center',
                              fontSize: '14px',
                              fontFamily: 'monospace',
                              fontWeight: 'bold',
                              border: `1px solid ${darkMode ? '#555' : '#DDD'}`,
                              minHeight: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {ticket}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div style={{
                      backgroundColor: darkMode ? '#2A2A2A' : '#F5F5F5',
                      padding: '12px',
                      borderRadius: '6px',
                      color: darkMode ? '#E0E0E0' : '#333',
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      lineHeight: '1.6',
                      wordWrap: 'break-word'
                    }}>
                      {prize.ticket_numbers}
                    </div>
                  );
                }
              })()
            )}
          </div>
        ))}
      </div>
    );
  };

  const LotteryList = ({ onItemClick, selectedId }) => (
    <div>
      <h2 style={{
        color: darkMode ? '#FF5252' : '#D32F2F',
        fontSize: '18px',
        marginBottom: '16px',
        fontWeight: 'bold'
      }}>
        Recent Results
      </h2>
      
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#121212' : '#FFF1F2',
      color: darkMode ? '#E0E0E0' : '#333',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease'
    }}>
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
            
            <h1 style={{
              color: darkMode ? '#FF5252' : '#D32F2F',
              margin: '0',
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 'bold'
            }}>
              Kerala Lottery Results
            </h1>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
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
                  Recent Results
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
                  marginBottom: '8px',
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
                  fontSize: '16px'
                }}>
                  Date: {formatDate(resultData.date)}
                </div>
                {resultData.is_bumper && (
                  <div style={{
                    backgroundColor: darkMode ? '#FF5252' : '#D32F2F',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginTop: '8px'
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
    </div>
  );
};

export default KeralaLotteryApp;