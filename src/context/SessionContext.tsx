import React, { createContext, useContext, useState } from "react";

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
  items: SessionItem[];
  itemsTotalMmk: number;
}

interface SessionContextValue {
  sessions: ActiveSession[];
  addSession: (s: Omit<ActiveSession, "id" | "startTime" | "items" | "itemsTotalMmk">) => void;
  removeSession: (id: string) => void;
  addItem: (sessionId: string, item: { productId: string; name: string; unitPriceMmk: number }) => void;
  changeItemQty: (sessionId: string, productId: string, qty: number) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  const addSession = (s: Omit<ActiveSession, "id" | "startTime" | "items" | "itemsTotalMmk">) => {
    const newSession: ActiveSession = {
      ...s,
      id: `${s.stationCode}_${Date.now()}`,
      startTime: Date.now(),
      items: [],
      itemsTotalMmk: 0,
    };

    setSessions((prev) => [newSession, ...prev]);
  };

  const removeSession = (id: string) => {
    setSessions((prev) => prev.filter((x) => x.id !== id));
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
    <SessionContext.Provider value={{ sessions, addSession, removeSession, addItem, changeItemQty }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSessions must be used within SessionProvider");
  return ctx;
};
