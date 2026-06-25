import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy: {
      //any request going to /api will get this proxy appended
      '/api': 'http://localhost:3000',
    }
  },
  plugins: [react()],
})
