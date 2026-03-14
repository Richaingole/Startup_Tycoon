import { useEffect, useRef } from 'react';
import { useGameStore } from '../store';

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const tickRef = useRef(tick);

  // Keep the ref updated with the latest tick function
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}
