export interface Game {
  id: number;
  name: string;
  coverImage: string | null;
  platform: string;
}

export async function getGames() {
  return window.api.games.getAll();
}

export async function createGame(
  name: string,
  coverImage: string,
  platform = "PS4"
) {
  return window.api.games.create({
    name,
    coverImage,
    platform,
  });
}

export async function updateGame(
  id: number,
  name: string,
  coverImage: string,
  platform = "PS4"
) {
  return window.api.games.update({
    id,
    name,
    coverImage,
    platform,
  });
}

export async function deleteGame(id: number) {
  return window.api.games.delete(id);
}