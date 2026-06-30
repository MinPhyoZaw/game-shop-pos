const { app, BrowserWindow, ipcMain } = require("electron");
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


require("electron").ipcMain.handle(
  "games:create",
  async (_, data) => {
    const db = getPrisma();

    return await db.game.create({
      data: {
        name: data.name,
        coverImage: data.coverImage,
        platform: data.platform ?? "PS4",
      },
    });
  }
);

require('electron').ipcMain.handle(
  "games:update",
  async (_, data) => {
    const db = getPrisma();

    return await db.game.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        coverImage: data.coverImage,
        platform: data.platform,
      },
    });
  }
);






require('electron').ipcMain.handle(
  "games:delete",
  async (_, id) => {
    const db = getPrisma();

    return await db.game.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
);




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

ipcMain.handle("stations:updateRatesByType", async (_, ratesByType) => {
  const db = getPrisma();
  const updates = Object.entries(ratesByType).flatMap(([type, hourlyRateMmk]) => {
    const rate = Number(hourlyRateMmk) || 0;

    return [
      db.station.updateMany({
        where: { type, isActive: true },
        data: { hourlyRateMmk: rate },
      }),
      db.session.updateMany({
        where: {
          status: "running",
          station: { type },
        },
        data: { hourlyRateMmkSnapshot: rate },
      }),
    ];
  });

  await db.$transaction(updates);

  return await db.station.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
  });
});



const sessionInclude = {
  sessionItems: {
    include: {
      product: { select: { id: true, name: true } },
    },
  },
  game: { select: { id: true, name: true } },
  station: { select: { id: true, code: true, type: true } },
};

function mapSessionItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.product?.name,
    qty: item.qty,
    unitPriceMmkSnapshot: item.unitPriceMmkSnapshot,
    lineTotalMmk: item.lineTotalMmk,
  };
}

function mapSession(session) {
  const { sessionItems, startTime, endTime, createdAt, updatedAt, ...rest } = session;
  return {
    ...rest,
    startTime: startTime.toISOString(),
    endTime: endTime ? endTime.toISOString() : null,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    items: (sessionItems || []).map(mapSessionItem),
  };
}

ipcMain.handle("sessions:finish", async (_, sessionId) => {
  const db = getPrisma();

  const session = await db.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const endTime = new Date();

const elapsedMinutes =
  (endTime - session.startTime) / 60000;

const durationMinutes =
  Math.floor(elapsedMinutes);

const playCostMmk = Math.round(
  (elapsedMinutes / 60) *
  session.hourlyRateMmkSnapshot
);

  const updated = await db.session.update({
    where: { id: sessionId },
    data: {
      endTime,
      durationMinutes,
      playCostMmk,
      status: "finished",
    },
    include: sessionInclude,
  });

  return mapSession(updated);
});

ipcMain.handle("sessions:getAll", async () => {
  const db = getPrisma();
  const sessions = await db.session.findMany({
    where: { status: "running" },
    orderBy: { startTime: "desc" },
    include: sessionInclude,
  });
  return sessions.map(mapSession);
});

ipcMain.handle("sessions:create", async (_, data) => {
  const db = getPrisma();
  const session = await db.session.create({
    data: {
      stationId: data.stationId,
      gameId: data.gameId,
      note: data.note || null,
      startTime: new Date(),
      hourlyRateMmkSnapshot: data.hourlyRateMmkSnapshot,
      durationMinutes: data.durationMinutes ?? null,
      status: "running",
    },
    include: sessionInclude,
  });
  return mapSession(session);
});

ipcMain.handle("sessions:addItem", async (_, data) => {
  const db = getPrisma();

  const existing = await db.sessionItem.findFirst({
    where: {
      sessionId: data.sessionId,
      productId: data.productId,
    },
  });

  if (existing) {
    const qty = existing.qty + 1;
    const updated = await db.sessionItem.update({
      where: { id: existing.id },
      data: {
        qty,
        lineTotalMmk: qty * existing.unitPriceMmkSnapshot,
      },
      include: { product: { select: { id: true, name: true } } },
    });
    return mapSessionItem(updated);
  }

  const created = await db.sessionItem.create({
    data: {
      sessionId: data.sessionId,
      productId: data.productId,
      qty: 1,
      unitPriceMmkSnapshot: data.unitPriceMmk,
      lineTotalMmk: data.unitPriceMmk,
    },
    include: { product: { select: { id: true, name: true } } },
  });
  return mapSessionItem(created);
});

ipcMain.handle("sessions:changeItemQty", async (_, data) => {
  const db = getPrisma();

  const existing = await db.sessionItem.findFirst({
    where: {
      sessionId: data.sessionId,
      productId: data.productId,
    },
  });

  if (!existing) return null;

  if (data.qty <= 0) {
    await db.sessionItem.delete({ where: { id: existing.id } });
    return null;
  }

  const updated = await db.sessionItem.update({
    where: { id: existing.id },
    data: {
      qty: data.qty,
      lineTotalMmk: data.qty * existing.unitPriceMmkSnapshot,
    },
    include: { product: { select: { id: true, name: true } } },
  });
  return mapSessionItem(updated);
});

ipcMain.handle("sessions:getAllWithDetails", async () => {
  const db = getPrisma();
  const sessions = await db.session.findMany({
    orderBy: { startTime: "desc" },
    include: sessionInclude,
  });
  return sessions.map(mapSession);
});

ipcMain.handle(
  "sessions:getReport",
  async (_, month, year) => {
    const db = getPrisma();

    const currentDate = new Date();

    const selectedMonth =
      month ?? currentDate.getMonth() + 1;

    const selectedYear =
      year ?? currentDate.getFullYear();

    let startDate;
    let endDate;

    // Today report
    if (selectedMonth === 0) {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );

      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      );
    }
    // Monthly report
    else {
      startDate = new Date(
        selectedYear,
        selectedMonth - 1,
        1
      );

      endDate = new Date(
        selectedYear,
        selectedMonth,
        1
      );
    }

    const sessions = await db.session.findMany({
      where: {
        status: "finished",
        endTime: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: sessionInclude,
    });

    const playIncome = sessions.reduce(
      (sum, s) => sum + (s.playCostMmk || 0),
      0
    );

    const productIncome = sessions.reduce(
      (sum, s) =>
        sum +
        s.sessionItems.reduce(
          (itemSum, i) =>
            itemSum + i.lineTotalMmk,
          0
        ),
      0
    );

    const totalIncome =
      playIncome + productIncome;

    const totalSessions =
      sessions.length;

    const byStation = sessions.reduce(
      (acc, s) => {
        const code = s.station.code;

        if (!acc[code]) {
          acc[code] = {
            playIncome: 0,
            productIncome: 0,
            sessions: 0,
          };
        }

        acc[code].playIncome +=
          s.playCostMmk || 0;

        acc[code].productIncome +=
          s.sessionItems.reduce(
            (itemSum, i) =>
              itemSum + i.lineTotalMmk,
            0
          );

        acc[code].sessions += 1;

        return acc;
      },
      {}
    );

    return {
      totalIncome,
      playIncome,
      productIncome,
      totalSessions,
      byStation,
    };
  }
);
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