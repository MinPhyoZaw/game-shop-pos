export {};

declare global {
  interface Window {
    api: {
      games: {
        getAll(): Promise<any[]>;
      };
      products: {
        getAll(): Promise<any[]>;
      };
      stations: {
        getAll(): Promise<any[]>;
      };
      sessions: {
        getAll(): Promise<any[]>;
      };
    };
  }
}