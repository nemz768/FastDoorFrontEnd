import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vitePrerender from 'vite-plugin-prerender';
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    vitePrerender({
      staticDir: path.resolve(__dirname, 'dist'),
      routes: ['/login',],  // список маршрутов для пререндеринга
      // другие настройки, например, задержка, postProcess и др.
    })
  ],
  server: {
    port: 8081,
  },
})

