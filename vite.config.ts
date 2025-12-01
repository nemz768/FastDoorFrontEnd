import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 8081,
    proxy: {
      '/api': { // Предположим, все API-запросы идут с префиксом /api
        target: 'http://localhost:8080', // Адрес вашего API в Docker
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Убрать /api перед отправкой в API, если нужно
      },
    }
  },
})

