import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: 5000,
      proxy: {
        '/api/weather': {
          target: 'https://api.openweathermap.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/weather/, '/data/2.5/weather')
        },

      }
    }
  }
})