import { defineConfig, UserConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ai-image-recognition-app-react/',
  plugins: [react()],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
    globals: true,
    setupFiles: 'src/setupTests.ts',
  },
   build: {
    // Ensure model files are included in build
    assetsInclude: ['**/*.json', '**/*.bin'],
    // Copy public files exactly as they are
    copyPublicDir: true
  },
} as UserConfig)
