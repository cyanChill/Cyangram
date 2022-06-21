/*
  TODO: Custom hook to fetch data based on amount
    - Maybe first get a date such that we don't fetch the same results
    - 
  
  TODO: Turn API route to use "slug"
    - Since we'll prob have a "date" query & "page" query
*/
import { useState, useEffect, useCallback } from "react";

/* "query" is an object with "method", "application", and "body" fields (we expect a POST method) */
const useLazyFetch = (url, amount) => {
  // Uses this time as a point of reference for future results
  const [asOfTime, setAsOfTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);
  const [usedIds, setUsedIds] = useState([]);

  const [finished, setFinished] = useState(false);

  const sendQuery = useCallback(async () => {
    try {
      console.log("Triggered");
      setLoading(true);
      setError(false);

      const res = await fetch(`${url}?fromDate=${asOfTime}&amount=${amount}`, {
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

  useEffect(() => {
    if (!finished) {
      sendQuery();
    }
  }, [finished, sendQuery]);

  return { loading, error, results };
};

export default useLazyFetch;
