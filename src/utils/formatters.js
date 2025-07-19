// utils/formatters.js
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatCurrency = (amount) => {
  return parseFloat(amount).toLocaleString('en-IN');
};

export const getPrizeLabel = (prizeType) => {
  if (!prizeType) return 'Prize';
  
  const type = prizeType.toLowerCase();
  if (type.includes('1st') || type === '1st') return '1st Prize';
  if (type.includes('2nd') || type === '2nd') return '2nd Prize';
  if (type.includes('3rd') || type === '3rd') return '3rd Prize';
  if (type.includes('consolation') || type.includes('സമാധാനം')) return 'Consolation Prize';
  if (type.includes('4th')) return '4th Prize';
  if (type.includes('5th')) return '5th Prize';
  if (type.includes('6th')) return '6th Prize';
  if (type.includes('7th')) return '7th Prize';
  if (type.includes('8th')) return '8th Prize';
  if (type.includes('9th')) return '9th Prize';
  return `${prizeType} Prize`;
};