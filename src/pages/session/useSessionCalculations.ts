import { useMemo } from "react";
import type { ActiveSession } from "../../context/SessionContext";

export function useSessionCalculations(session: ActiveSession, now: number) {
  return useMemo(() => {
    const elapsedMs = now - session.startTime;
    const minutes = Math.ceil(elapsedMs / 60000);
    const ratePerMinute = session.stationType === "PS4" ? 50 : session.stationType === "PS3" ? Math.round(2000 / 60) : 0;
    const playCost = minutes * ratePerMinute;
    const itemsTotal = session.itemsTotalMmk || 0;
    const totalAmount = playCost + itemsTotal;
    
    return { elapsedMs, minutes, ratePerMinute, playCost, itemsTotal, totalAmount };
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