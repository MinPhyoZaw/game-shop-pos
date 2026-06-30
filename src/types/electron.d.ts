export {};

declare global {
  interface Window {
    api: {
      games: {
        getAll(): Promise<Game[]>;
        create(data: {
          name: string;
          coverImage?: string;
          platform?: string;
        }): Promise<Game>;
        update(data: {
          id: number;
          name: string;
          coverImage?: string;
          platform?: string;
        }): Promise<Game>;
        delete(id: number): Promise<Game>;
      };
      products: {
        getAll(): Promise<Product[]>;
        create(data: {
          name: string;
          priceMmk: number;
        }): Promise<Product>;
        update(data: {
          id: number;
          name: string;
          priceMmk: number;
        }): Promise<Product>;
        delete(id: number): Promise<Product>;
      };
      stations: {
        getAll(): Promise<Station[]>;
        updateRatesByType(ratesByType: Record<string, number>): Promise<Station[]>;
      };
      sessions: {
        getAll(): Promise<SessionWithDetails[]>;
      
        create(data: {
          stationId: number;
          gameId: number;
          note?: string;
          hourlyRateMmkSnapshot: number;
          durationMinutes?: number;
        }): Promise<SessionWithDetails>;
      
        addItem(data: {
          sessionId: number;
          productId: number;
          unitPriceMmk: number;
        }): Promise<SessionItem>;
      
        changeItemQty(data: {
          sessionId: number;
          productId: number;
          qty: number;
        }): Promise<SessionItem | null>;
      
        finish(sessionId: number): Promise<SessionWithDetails>;
      
        getAllWithDetails(): Promise<SessionWithDetails[]>;
      
        getReport(
          month?: number,
          year?: number
        ): Promise<SessionReport>;
      };
    };
  }
}

interface SessionItem {
  id: number;
  productId: number;
  productName?: string;
  qty: number;
  unitPriceMmkSnapshot: number;
  lineTotalMmk: number;
}

interface SessionReport {
  totalIncome: number;
  playIncome: number;
  productIncome: number;
  totalSessions: number;
  byStation: Record<string, { playIncome: number; productIncome: number; sessions: number }>;
}