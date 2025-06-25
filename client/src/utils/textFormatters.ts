export const formatDisplayName = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
