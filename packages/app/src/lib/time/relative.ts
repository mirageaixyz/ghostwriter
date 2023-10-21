export function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  if (years > 0) {
    return years === 1 ? "a year ago" : `${years} years ago`;
  }
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  if (months > 0) {
    return months === 1 ? "a month ago" : `${months} months ago`;
  }
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  if (weeks > 0) {
    return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return days === 1 ? "a day ago" : `${days} days ago`;
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) {
    return hours === 1 ? "an hour ago" : `${hours} hours ago`;
  }
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) {
    return minutes === 1 ? "a minute ago" : `${minutes} minutes ago`;
  }
  const seconds = Math.floor(diff / 1000);
  if (seconds > 0) {
    return seconds === 1 ? "a second ago" : `${seconds} seconds ago`;
  }
  return "just now";
}
