import { ElectronAPI } from '@electron-toolkit/preload'

type AppAPI = {
  ping: () => Promise<void>
  openExternal: (url: string) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: AppAPI
  }
}

export {}
