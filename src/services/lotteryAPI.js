// services/lotteryAPI.js
// ...existing code...
import config from '../config/environment';

const API_BASE_URL = `${config.API_BASE_URL}/results`;
// ...existing code...

export const fetchLotteryList = async () => {
  const response = await fetch(`${API_BASE_URL}/results/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch lottery list');
  }

  const data = await response.json();
  
  if (data.status !== 'success' || !data.results) {
    throw new Error('Invalid response format');
  }

  return data;
};

export const fetchLotteryResult = async (uniqueId) => {
  const response = await fetch(`${API_BASE_URL}/get-by-unique-id/`, {
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
  
  if (data.status !== 'success' || !data.result) {
    throw new Error('Invalid response format');
  }

  return data;
};