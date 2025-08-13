import { formatDistanceToNow } from 'date-fns';

// Inside your component where you display the time
const formatTimeAgo = (timestamp: string | number | Date) => {
  if (!timestamp) return 'Unknown time';
  
  try {
    // Handle different timestamp formats
    let date;
    if (typeof timestamp === 'string') {
      // Check if it's a Unix timestamp in string form
      if (/^\d+$/.test(timestamp)) {
        date = new Date(parseInt(timestamp) * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else if (typeof timestamp === 'number') {
      // If it's a Unix timestamp (seconds since epoch)
      if (timestamp < 10000000000) {
        date = new Date(timestamp * 1000);
      } else {
        date = new Date(timestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Then use this function in your JSX
// <span className="text-xs text-gray-500">{formatTimeAgo(notification.timestamp)}</span>