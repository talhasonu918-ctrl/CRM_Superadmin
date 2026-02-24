import { useState, useEffect } from 'react';

export const useAgingColor = (readyTime: number) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calculate = () => {
      const diff = Math.floor((Date.now() - readyTime) / 60000);
      setElapsed(diff);
    };
    calculate();
    const interval = setInterval(calculate, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [readyTime]);

  if (elapsed >= 10) return 'text-red-500 font-black animate-pulse';
  if (elapsed >= 5) return 'text-yellow-500 font-bold';
  return 'text-green-500 font-medium';
};
