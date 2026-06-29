import { useMemo } from "react";
import type { SessionWithDetails } from "../../context/SessionContext";

export function useSessionCalculations(
  session: SessionWithDetails,
  now: number
) {
  return useMemo(() => {
    const startTime =
      new Date(session.startTime).getTime();

    const elapsedMs =
      now - startTime;

    const minutes =
      Math.floor(elapsedMs / 60000);

    const playCost = Math.round(
      (minutes / 60) *
      session.hourlyRateMmkSnapshot
    );

    const itemsTotal =
      session.items.reduce(
        (sum, i) =>
          sum + i.lineTotalMmk,
        0
      );

    const totalAmount =
      playCost + itemsTotal;

    return {
      elapsedMs,
      minutes,
      playCost,
      itemsTotal,
      totalAmount,
    };
  }, [session, now]);
}

export function useDuration(start: number, now: number) {
  return useMemo(() => {
    const diff = now - start;
    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / 60000) % 60;
    const hr = Math.floor(diff / 3600000);
    return `${hr.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }, [start, now]);
}
