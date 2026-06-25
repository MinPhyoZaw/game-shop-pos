export {};

declare global {
  interface Window {
    api: {
      games: {
        getAll(): Promise<any[]>;

          create(data: {
    name: string;
    coverImage?: string;
    platform?: string;
  }): Promise<any>;

  update(data: {
    id: number;
    name: string;
    coverImage?: string;
    platform?: string;
  }): Promise<any>;

  delete(id: number): Promise<any>;
      };
      products: {
        getAll(): Promise<any[]>;
         create(data: {
          name: string;
          priceMmk: number;
        }): Promise<any>;

        update(data: {
          id: number;
          name: string;
          priceMmk: number;
        }): Promise<any>;

        delete(id: number): Promise<any>;
      };

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