const { ipcMain } = require("electron");
const prisma = require("../db/prisma");

function registerStationIpc() {
  ipcMain.handle("stations:getAll", async () => {
    return prisma.station.findMany({
      orderBy: {
        code: "asc",
      },
    });
  });
}

module.exports = registerStationIpc;