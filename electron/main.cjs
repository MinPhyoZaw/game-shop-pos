const { app, BrowserWindow } = require("electron");
const { PrismaClient } = require("@prisma/client");

let mainWindow = null;
let prisma = null;

const path = require("path");
const { electron } = require("process");

function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

function createWindow() {
  const preloadPath = path.join(__dirname, "preload.cjs");

  console.log("PRELOAD PATH:", preloadPath);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.webContents.openDevTools();

  mainWindow.loadURL("http://localhost:5173");
}

// Register IPC handlers
require("electron").ipcMain.handle("games:getAll", async () => {
  const db = getPrisma();
  return await db.game.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
});

require("electron").ipcMain.handle("products:getAll", async () => {
  const db = getPrisma();
  return await db.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
});

require("electron").ipcMain.handle(
  "products:create",
  async (_, data) => {
    const db = getPrisma();

    return await db.product.create({
      data: {
        name: data.name,
        priceMmk: data.priceMmk,
      },
    });
  }
);

require('electron').ipcMain.handle('products:delete', async (_, id) => {
  const db = getPrisma();
  return await db.product.delete({ where: { id } });
});

require("electron").ipcMain.handle(
  "products:update",
  async (_, data) => {
    const db = getPrisma();

    return await db.product.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        priceMmk: data.priceMmk,
      },
    });
  }
);

require("electron").ipcMain.handle("stations:getAll", async () => {
  const db = getPrisma();
  return await db.station.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
  });
});

require("electron").ipcMain.handle("sessions:getAll", async () => {
  const db = getPrisma();
  return await db.session.findMany({
    where: { status: "running" },
    orderBy: { startTime: "desc" },
    include: {
      items: true,
      game: { select: { id: true, name: true } },
      station: { select: { id: true, code: true, type: true } },
    },
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});