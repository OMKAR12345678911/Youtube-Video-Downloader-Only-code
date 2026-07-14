const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    downloadVideo: (url) => ipcRenderer.send('trigger-download', url)
});
