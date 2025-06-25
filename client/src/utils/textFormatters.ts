export const formatDisplayName = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatStatus = (status: string): string => {
  if (!status) return '';
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'overdue':
      return 'Overdue';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};
