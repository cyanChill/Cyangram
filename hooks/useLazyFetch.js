import { useState, useEffect, useCallback } from "react";

/* "query" is an object with "method", "application", and "body" fields (we expect a POST method) */
const useLazyFetch = (url, amount, continuousFetchInterval = 0) => {
  // Uses this time as a point of reference for future results
  const [asOfTime, setAsOfTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);
  const [usedIds, setUsedIds] = useState([]);

  const [initialized, setInialized] = useState(false);
  const [finished, setFinished] = useState(false);

  const sendQuery = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const route = `${url}${
        url.charAt(url.length - 1) === "&" ? "" : "?"
      }fromDate=${asOfTime}&amount=${amount}`;
      const res = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usedIds: usedIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.err);

      if (data.newData.length > 0) {
        setResults((prev) => [...prev, ...data.newData]);
        setUsedIds((prev) => [...new Set([...prev, ...data.newIds])]);
      } else {
        setFinished(true);
      }
      setLoading(false);
    } catch (err) {
      setError(err);
      setFinished(true);
    }
  }, [url, amount, asOfTime, usedIds]);

  const forceUpdate = useCallback(() => {
    setAsOfTime(Date.now());
  }, []);

  useEffect(() => {
    /* Reset hook if the url changes (when hook has been initialized already) */
    if (initialized) {
      setAsOfTime(Date.now());
      setLoading(true);
      setResults([]);
      setUsedIds([]);
      setError(false);
      setFinished(false);
      setInialized(false);
    }
  }, [url]);

  useEffect(() => {
    /* Continuously Fetch Updates based on interval after getting initial results */
    let interval = null;
    if (continuousFetchInterval > 0) {
      interval = setInterval(() => {
        // Attempt to fetch new results once we've finished fetching all initial content
        if (finished) {
          setAsOfTime(Date.now());
        }
      }, continuousFetchInterval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [finished, continuousFetchInterval]);

  useEffect(() => {
    if (initialized) {
      sendQuery();
    }
  }, [sendQuery]);

  useEffect(() => {
    if (!initialized) {
      setInialized(true);
    }
    if (!finished) {
      sendQuery();
    }
  }, [finished, sendQuery]);

  return { loading, error, results, forceUpdate };
};

export default useLazyFetch;
