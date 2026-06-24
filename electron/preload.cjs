console.log("PRELOAD LOADED");
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  games: {
    getAll: () => ipcRenderer.invoke("games:getAll"),
  },
  products: {
    getAll: () => ipcRenderer.invoke("products:getAll"),
  },
  stations: {
    getAll: () => ipcRenderer.invoke("stations:getAll"),
  },
  sessions: {
    getAll: () => ipcRenderer.invoke("sessions:getAll"),
  },
});