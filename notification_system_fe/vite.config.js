import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/logs': {
        target: 'http://20.207.122.201',
        changeOrigin: true,
        rewrite: (path) => '/evaluation-service/logs',
      },
      '/notifications': {
        target: 'http://20.207.122.201',
        changeOrigin: true,
        rewrite: (path) => '/evaluation-service/notifications',
      },
    },
  },
})