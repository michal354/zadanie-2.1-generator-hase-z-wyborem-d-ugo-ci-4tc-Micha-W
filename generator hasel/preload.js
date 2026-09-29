const { contextBridge, clipboard } = require("electron");

contextBridge.exposeInMainWorld("desktop", {
  copy(text) {
    clipboard.writeText(String(text ?? ""));
  },
});
