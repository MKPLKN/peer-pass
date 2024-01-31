// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', { })
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipcRenderer', {
      ...ipcRenderer,
      on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
      }
    })
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = { }
  window.api = api
}
