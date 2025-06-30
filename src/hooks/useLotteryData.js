import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://lottery-app-5bve.onrender.com/api/results';

export const useLotteryData = () => {
  const [lotteryDraws, setLotteryDraws] = useState([]);
  const [selectedResults, setSelectedResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Helper function for date formatting
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Fetch data on component mount
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

  return {
    lotteryDraws,
    selectedResults,
    loading,
    resultsLoading,
    error,
    fetchDrawResults,
    refetchDraws: fetchAllDraws
  };
};