// hooks/useLotteryData.js
import { useState, useEffect } from 'react';
import { fetchLotteryList, fetchLotteryResult } from '../services/lotteryAPI';

export const useLotteryData = () => {
  const [lotteryResults, setLotteryResults] = useState([]);
  const [selectedLottery, setSelectedLottery] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLotteryList();
  }, []);

  const loadLotteryList = async () => {
    setListLoading(true);
    try {
      const data = await fetchLotteryList();
      setLotteryResults(data.results);
      
      // Auto-select the latest (first) lottery result
      if (data.results.length > 0) {
        const latestLottery = data.results[0];
        setSelectedLottery(latestLottery);
        await loadLotteryResult(latestLottery.unique_id);
      }
    } catch (err) {
      setError('Failed to load lottery list. Please try again.');
      console.error('Error fetching lottery list:', err);
    } finally {
      setListLoading(false);
    }
  };

  const loadLotteryResult = async (uniqueId) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchLotteryResult(uniqueId);
      setResultData(data.result);
    } catch (err) {
      setError('Failed to load lottery result. Please try again.');
      console.error('Error fetching lottery result:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLotterySelect = (lottery) => {
    setSelectedLottery(lottery);
    loadLotteryResult(lottery.unique_id);
  };

  const refetchLotteryList = () => {
    loadLotteryList();
  };

  return {
    lotteryResults,
    selectedLottery,
    resultData,
    loading,
    listLoading,
    error,
    handleLotterySelect,
    refetchLotteryList
  };
};