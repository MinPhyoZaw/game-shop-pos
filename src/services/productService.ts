export interface Product {
  id: string;
  name: string;
  priceMmk: number;
}

export const getProducts = async (): Promise<Product[]> => {
  // Mirror prisma seed data for frontend use
  return [
    { id: "1", name: "Extra Controller", priceMmk: 1000 },
    { id: "2", name: "Cold Drink", priceMmk: 1000 },
    { id: "3", name: "Coffee", priceMmk: 1500 },
    { id: "4", name: "Instant Noodle", priceMmk: 2000 },
    { id: "5", name: "Fried Potato", priceMmk: 2500 },
    { id: "6", name: "Energy Drink", priceMmk: 1500 },
    { id: "7", name: "Mineral Water", priceMmk: 500 },
    { id: "8", name: "Chicken Burger", priceMmk: 3500 },
    { id: "9", name: "Hot Dog", priceMmk: 3000 },
    { id: "10", name: "Ice Cream", priceMmk: 2000 },
  ];
};
