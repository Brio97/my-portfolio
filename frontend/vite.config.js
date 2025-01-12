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
        '/api/translate/languages': {
          target: 'https://translation.googleapis.com/language/translate/v2/languages',
          changeOrigin: true,
          headers: {
            'X-Goog-Api-Key': env.VITE_GOOGLE_TRANSLATE_API_KEY
          },
          rewrite: (path) => `?key=${env.VITE_GOOGLE_TRANSLATE_API_KEY}&target=en`
        },
        '/api/translate': {
          target: 'https://translation.googleapis.com/language/translate/v2',
          changeOrigin: true,
          headers: {
            'X-Goog-Api-Key': env.VITE_GOOGLE_TRANSLATE_API_KEY
          },
          rewrite: (path) => `?key=${env.VITE_GOOGLE_TRANSLATE_API_KEY}`
        }
      }
    }
  }
})