export const timeSince = (posix) => {
  const origDate = new Date(posix).getTime();
  const nowDate = new Date().getTime();

  const secDiff = Math.floor((nowDate - origDate) / 10e3);

  let interval = secDiff; // In terms of years
  if (interval < 60) return `${interval}s ago`;

  interval = Math.floor(interval / 60);
  if (interval < 60) return `${interval}min${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(interval / 60);
  if (interval < 24) return `${interval}hr${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(interval / 24);
  if (interval < 30) return `${interval}day${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(interval / 30);
  if (interval < 12) return `${interval}mth${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(interval / 12);
  return `${interval}yr${interval > 1 ? "s" : ""} ago`;
};
