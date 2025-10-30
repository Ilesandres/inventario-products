import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    // Añade esta configuración para el renderer
    server: {
      fs: {
        allow: ['..', process.cwd()] // Permite acceder a archivos del sistema
      }
    },
    // Configuración de assets
    build: {
      assetsInlineLimit: 0 // Esto evita que las imágenes se conviertan en base64
    }
  }
})