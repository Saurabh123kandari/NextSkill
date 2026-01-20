/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a date string into a relative time string (e.g., "2 hours ago")
 * @param dateString - ISO date string or SQLite datetime string
 * @returns Relative time string
 */
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Unknown';
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 30) {
    return 'Just now';
  }

  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  if (diffMinutes === 1) {
    return '1 minute ago';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  if (diffHours === 1) {
    return '1 hour ago';
  }

  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  if (diffWeeks === 1) {
    return '1 week ago';
  }

  if (diffWeeks < 4) {
    return `${diffWeeks} weeks ago`;
  }

  if (diffMonths === 1) {
    return '1 month ago';
  }

  if (diffMonths < 12) {
    return `${diffMonths} months ago`;
  }

  // For older dates, show the actual date
  return date.toLocaleDateString();
};

/**
 * Formats a date to a readable string
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 20, 2026")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats a date to include time
 * @param dateString - ISO date string
 * @returns Formatted datetime string (e.g., "Jan 20, 2026, 2:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Unknown';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Gets the current timestamp in ISO format
 * @returns Current ISO timestamp
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export default {
  formatTimeAgo,
  formatDate,
  formatDateTime,
  getCurrentTimestamp,
};
