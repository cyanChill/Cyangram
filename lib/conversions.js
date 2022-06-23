export const timeSince = (posix) => {
  const nowposix = Date.now();

  const secDiff = Math.floor((nowposix - posix) / 1000);

  let interval = secDiff; // In terms of years
  if (interval < 60) return `${interval}s ago`;

  interval = Math.floor(interval / 60);
  if (interval < 60) return `${interval} min${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(interval / 60);
  if (interval < 24) return `${interval} hr${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(interval / 24);
  if (interval < 30) return `${interval} day${interval > 1 ? "s" : ""} ago`;

  const dateOptions = { month: "long", day: "numeric", year: "numeric" };
  return `${new Date(nowposix).toLocaleDateString(undefined, dateOptions)}`;
};

export const followConversion = (numFollow) => {
  if (numFollow < 10000) {
    return numFollow;
  } else if (numFollow < 1000000) {
    return `${(numFollow / 1000).toFixed()}K`;
  } else if (numFollow >= 1000000) {
    return `${(numFollow / 1000000).toFixed(1)}M`;
  }
};
