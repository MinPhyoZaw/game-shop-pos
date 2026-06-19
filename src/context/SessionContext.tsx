import React, { createContext, useContext, useState, useRef } from "react";

export interface SessionItem {
  productId: string;
  name: string;
  qty: number;
  unitPriceMmk: number;
  lineTotalMmk: number;
}

export interface ActiveSession {
  id: string;
  stationCode: string;
  stationType?: string;
  game: string;
  note?: string;
  startTime: number;
  durationMinutes?: number;
  endTime?: number;
  status?: "running" | "ended";
  preAlert?: boolean;
  alertDismissed?: boolean;
  items: SessionItem[];
  itemsTotalMmk: number;
}

interface SessionContextValue {
  sessions: ActiveSession[];
  addSession: (s: Omit<ActiveSession, "id" | "startTime" | "items" | "itemsTotalMmk" | "endTime" | "status">) => void;
  removeSession: (id: string) => void;
  addItem: (sessionId: string, item: { productId: string; name: string; unitPriceMmk: number }) => void;
  changeItemQty: (sessionId: string, productId: string, qty: number) => void;
  markSessionEnded: (id: string) => void;
  dismissPreAlert: (id: string) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});
  const preAlertTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  const addSession = (s: Omit<ActiveSession, "id" | "startTime" | "items" | "itemsTotalMmk" | "endTime" | "status">) => {
    const newSession: ActiveSession = {
      ...s,
      id: `${s.stationCode}_${Date.now()}`,
      startTime: Date.now(),
      items: [],
      itemsTotalMmk: 0,
      status: "running",
    };

    setSessions((prev) => [newSession, ...prev]);

    if (s.durationMinutes && s.durationMinutes > 0) {
      const ms = s.durationMinutes * 60 * 1000;
      const end = newSession.startTime + ms;
      newSession.endTime = end;

      // schedule auto-end
      const to = setTimeout(() => {
        markSessionEnded(newSession.id);
      }, ms);
      timeoutsRef.current[newSession.id] = to;

      // schedule pre-alert 5 minutes before end if possible
      const fiveMinMs = 5 * 60 * 1000;
      if (ms > fiveMinMs) {
        const preMs = ms - fiveMinMs;
        const preTo = setTimeout(() => {
          // set preAlert flag and make sure alert not dismissed
          setSessions((prev) =>
            prev.map((ses) =>
              ses.id === newSession.id ? { ...ses, preAlert: true, alertDismissed: false } : ses
            )
          );
        }, preMs);
        preAlertTimeoutsRef.current[newSession.id] = preTo;
      }
    }
  };

  const removeSession = (id: string) => {
    // clear any timeout
    const t = timeoutsRef.current[id];
    if (t) clearTimeout(t as ReturnType<typeof setTimeout>);
    delete timeoutsRef.current[id];
    const pt = preAlertTimeoutsRef.current[id];
    if (pt) clearTimeout(pt as ReturnType<typeof setTimeout>);
    delete preAlertTimeoutsRef.current[id];

    setSessions((prev) => prev.filter((x) => x.id !== id));
  };

  const markSessionEnded = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return { ...s, status: "ended", endTime: s.endTime ?? Date.now() };
      })
    );

    const t = timeoutsRef.current[id];
    if (t) {
      clearTimeout(t as ReturnType<typeof setTimeout>);
      delete timeoutsRef.current[id];
    }

    const pt = preAlertTimeoutsRef.current[id];
    if (pt) {
      clearTimeout(pt as ReturnType<typeof setTimeout>);
      delete preAlertTimeoutsRef.current[id];
    }
  };

  const dismissPreAlert = (id: string) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, alertDismissed: true } : s)));
  };

  const addItem = (sessionId: string, item: { productId: string; name: string; unitPriceMmk: number }) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;

        const existing = s.items.find((it) => it.productId === item.productId);
        let items: SessionItem[];

        if (existing) {
          items = s.items.map((it) =>
            it.productId === item.productId
              ? { ...it, qty: it.qty + 1, lineTotalMmk: (it.qty + 1) * it.unitPriceMmk }
              : it
          );
        } else {
          items = [
            ...s.items,
            { productId: item.productId, name: item.name, qty: 1, unitPriceMmk: item.unitPriceMmk, lineTotalMmk: item.unitPriceMmk },
          ];
        }

        const itemsTotalMmk = items.reduce((a, b) => a + b.lineTotalMmk, 0);

        return { ...s, items, itemsTotalMmk };
      })
    );
  };

  const changeItemQty = (sessionId: string, productId: string, qty: number) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;

        let items = s.items.map((it) =>
          it.productId === productId ? { ...it, qty, lineTotalMmk: qty * it.unitPriceMmk } : it
        );

        items = items.filter((it) => it.qty > 0);

        const itemsTotalMmk = items.reduce((a, b) => a + b.lineTotalMmk, 0);

        return { ...s, items, itemsTotalMmk };
      })
    );
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession, removeSession, addItem, changeItemQty, markSessionEnded, dismissPreAlert }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessions must be used within SessionProvider");
  return ctx;
};
