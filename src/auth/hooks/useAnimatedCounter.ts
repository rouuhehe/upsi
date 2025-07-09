import { useEffect, useState } from "react";

export function useAnimatedCount(
  target: number,
  duration: number = 2000,
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const easeOutQuad = (t: number) => t * (2 - t);

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      const value = Math.round(eased * target);
      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }, [target, duration]);

  return count;
}
