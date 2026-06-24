const isElectron = (): boolean => {
  return typeof window !== "undefined" && !!window.api;
};

const fallbackGames: Game[] = [
  { id: 1, name: "Uncharted", coverImage: "/game-covers/uncharted.jpg", platform: "PS4", isInstalled: true, isActive: true, createdAt: new Date().toISOString() },
  { id: 2, name: "FarCry 6", coverImage: "/game-covers/farcry.jpg", platform: "PS4", isInstalled: true, isActive: true, createdAt: new Date().toISOString() },
  { id: 3, name: "GTA V", coverImage: "/game-covers/gta.jpg", platform: "PS4", isInstalled: true, isActive: true, createdAt: new Date().toISOString() },
  { id: 4, name: "PES", coverImage: "/game-covers/pes.jpg", platform: "PS4", isInstalled: true, isActive: true, createdAt: new Date().toISOString() },
  { id: 5, name: "Naruto", coverImage: "/game-covers/naruto.jpg", platform: "PS4", isInstalled: true, isActive: true, createdAt: new Date().toISOString() },
  { id: 6, name: "Resident Evil 4", coverImage: "/game-covers/resident-evil.jpg", platform: "PS4", isInstalled: true, isActive: true, createdAt: new Date().toISOString() },
];

const fallbackProducts: Product[] = [
  { id: 1, name: "Extra Controller", priceMmk: 1000, isActive: true, createdAt: new Date().toISOString() },
  { id: 2, name: "Cold Drink", priceMmk: 1000, isActive: true, createdAt: new Date().toISOString() },
  { id: 3, name: "Coffee", priceMmk: 1500, isActive: true, createdAt: new Date().toISOString() },
  { id: 4, name: "Instant Noodle", priceMmk: 2000, isActive: true, createdAt: new Date().toISOString() },
  { id: 5, name: "Fried Potato", priceMmk: 2500, isActive: true, createdAt: new Date().toISOString() },
  { id: 6, name: "Energy Drink", priceMmk: 1500, isActive: true, createdAt: new Date().toISOString() },
  { id: 7, name: "Mineral Water", priceMmk: 500, isActive: true, createdAt: new Date().toISOString() },
  { id: 8, name: "Chicken Burger", priceMmk: 3500, isActive: true, createdAt: new Date().toISOString() },
  { id: 9, name: "Hot Dog", priceMmk: 3000, isActive: true, createdAt: new Date().toISOString() },
  { id: 10, name: "Ice Cream", priceMmk: 2000, isActive: true, createdAt: new Date().toISOString() },
];

const fallbackStations: Station[] = [
  { id: 1, code: "PS4-01", type: "PS4", hourlyRateMmk: 50, isActive: true },
  { id: 2, code: "PS4-02", type: "PS4", hourlyRateMmk: 50, isActive: true },
  { id: 3, code: "PS3-01", type: "PS3", hourlyRateMmk: 2000, isActive: true },
  { id: 4, code: "PS3-02", type: "PS3", hourlyRateMmk: 2000, isActive: true },
];

const fallbackSessions: SessionWithDetails[] = [];

export const api = {
  async getGames(): Promise<Game[]> {
    if (isElectron()) {
      return window.api!.games.getAll();
    }
    return fallbackGames;
  },

  async getProducts(): Promise<Product[]> {
    if (isElectron()) {
      return window.api!.products.getAll();
    }
    return fallbackProducts;
  },

  async getStations(): Promise<Station[]> {
    if (isElectron()) {
      return window.api!.stations.getAll();
    }
    return fallbackStations;
  },

  async getSessions(): Promise<SessionWithDetails[]> {
    if (isElectron()) {
      return window.api!.sessions.getAll();
    }
    return fallbackSessions;
  },
};