import type { Station } from "../types/station";


export const getStations = async (): Promise<Station[]> => {
  return [
    {
      id: 1,
      code: "PS4-1",
      type: "PS4",
      hourlyRateMmk: 3000,
      isActive: true,
    },
  ];
};