import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Expose a minimal, typed API to the renderer via contextBridge.
// Keep the toolkit electronAPI available for existing usage, but
// also expose a small `api` object with only the functions we need.
const api = {
  // simple ping that uses invoke (returns a Promise)
  ping: async (): Promise<void> => {
    await ipcRenderer.invoke('ping')
  },
  // open an external url; main validates it
  openExternal: async (url: string): Promise<boolean> => {
    return await ipcRenderer.invoke('open-external', url)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to renderer only if
// context isolation is enabled, otherwise just attach to window for dev.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
