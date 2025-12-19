import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // This tells Vite: "Don't try to optimize these, just use them as they are"
    exclude: ['@google/model-viewer']
  }
})