import React, { createContext, useContext, useState } from "react";

export interface SessionItem {
  id: number;
  productId: number;
  productName?: string;
  qty: number;
  unitPriceMmkSnapshot: number;
  lineTotalMmk: number;
}

export interface SessionWithDetails {
  id: number;
  stationId: number;
  gameId: number;
  note: string | null;
  startTime: string;
  endTime: string | null;
  hourlyRateMmkSnapshot: number;
  durationMinutes: number | null;
  playCostMmk: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: SessionItem[];
  game: { id: number; name: string };
  station: { id: number; code: string; type: string };
}

interface TimerState {
  preAlert: boolean;
  alertDismissed: boolean;
}

interface SessionContextValue {
  timerStates: Record<number, TimerState>;
  setPreAlert: (sessionId: number, value: boolean) => void;
  dismissPreAlert: (sessionId: number) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timerStates, setTimerStates] = useState<Record<number, TimerState>>({});

  const setPreAlert = (sessionId: number, value: boolean) => {
    setTimerStates((prev) => ({
      ...prev,
      [sessionId]: {
        ...(prev[sessionId] || { alertDismissed: false }),
        preAlert: value,
      },
    }));
  };

  const dismissPreAlert = (sessionId: number) => {
    setTimerStates((prev) => ({
      ...prev,
      [sessionId]: {
        ...(prev[sessionId] || {}),
        preAlert: false,
        alertDismissed: true,
      },
    }));
  };

  return (
    <SessionContext.Provider value={{ timerStates, setPreAlert, dismissPreAlert }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessions must be used within SessionProvider");
  return ctx;
};
