console.log("PRELOAD LOADED");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  games: {
    getAll: () => ipcRenderer.invoke("games:getAll"),
    create: (data) => ipcRenderer.invoke("games:create", data),
    chooseCover: () => ipcRenderer.invoke("games:chooseCover"),
    update: (data) => ipcRenderer.invoke("games:update", data),
    delete: (id) => ipcRenderer.invoke("games:delete", id),
  },
  products: {
    getAll: () => ipcRenderer.invoke("products:getAll"),
    create: (data) => ipcRenderer.invoke("products:create", data),
    delete: (id) => ipcRenderer.invoke("products:delete", id),
    update: (data) => ipcRenderer.invoke("products:update", data),
  },
  stations: {
    getAll: () => ipcRenderer.invoke("stations:getAll"),
    updateRatesByType: (ratesByType) =>
      ipcRenderer.invoke("stations:updateRatesByType", ratesByType),
  },
  sessions: {
    getAll: () => ipcRenderer.invoke("sessions:getAll"),
    create: (data) => ipcRenderer.invoke("sessions:create", data),
    addItem: (data) => ipcRenderer.invoke("sessions:addItem", data),
    changeItemQty: (data) => ipcRenderer.invoke("sessions:changeItemQty", data),
    finish: (sessionId) => ipcRenderer.invoke("sessions:finish", sessionId),
    getAllWithDetails: () => ipcRenderer.invoke("sessions:getAllWithDetails"),
    getReport: (month, year) =>
      ipcRenderer.invoke(
        "sessions:getReport",
        month,
        year
      ),
  },
});