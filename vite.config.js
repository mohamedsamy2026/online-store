import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

function getHtmlEntries() {
  const htmlDir = resolve(__dirname, 'HTML')
  const entries = {
    main: resolve(__dirname, 'index.html')
  }

  if (fs.existsSync(htmlDir)) {
    const files = fs.readdirSync(htmlDir)
    files.forEach(file => {
      if (file.endsWith('.html')) {
        const name = file.replace('.html', '')
        entries[name] = resolve(__dirname, `HTML/${file}`)
      }
    })
  }

  return entries
}

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: '/online-store/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: getHtmlEntries(),
    },
  },
  server: {
    open: true,
  },
})