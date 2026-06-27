/// <reference path="./types/electron.d.ts" />

interface Game {
  id: number;
  name: string;
  coverImage: string | null;
  platform: string;
  isInstalled: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  priceMmk: number;
  isActive: boolean;
  createdAt: string;
}

interface Station {
  id: number;
  code: string;
  type: string;
  hourlyRateMmk: number;
  isActive: boolean;
}

interface SessionItem {
  id: number;
  productId: number;
  productName?: string;
  qty: number;
  unitPriceMmkSnapshot: number;
  lineTotalMmk: number;
}

interface SessionWithDetails {
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

interface SessionReport {
  totalIncome: number;
  playIncome: number;
  productIncome: number;
  totalSessions: number;
  byStation: Record<string, { playIncome: number; productIncome: number; sessions: number }>;
}
