export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateProgress = (currentPage, totalPages) => {
  if (!totalPages || totalPages === 0) return 0;
  return Math.round((currentPage / totalPages) * 100);
};

export const getPagesLeft = (currentPage, totalPages) => {
  return Math.max(0, totalPages - currentPage);
};

export const getProgressColor = (progress) => {
  if (progress >= 75) return 'from-green-400 to-green-600';
  if (progress >= 25) return 'from-yellow-400 to-yellow-600';
  return 'from-red-400 to-orange-400';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getEstimatedFinishDate = (pagesLeft, avgPagesPerDay) => {
  if (!avgPagesPerDay || avgPagesPerDay === 0) return null;
  const daysRemaining = Math.ceil(pagesLeft / avgPagesPerDay);
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + daysRemaining);
  return finishDate;
};