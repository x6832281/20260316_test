import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        article: resolve(__dirname, 'src/article.html'),
        board: resolve(__dirname, 'src/board.html'),
        ai: resolve(__dirname, 'src/ai.html'),
        game: resolve(__dirname, 'src/game.html'),
        resource: resolve(__dirname, 'src/resource.html'),
        webnovel: resolve(__dirname, 'src/webnovel.html'),
        newbie: resolve(__dirname, 'src/newbie.html'),
        deai: resolve(__dirname, 'src/deai.html'),
        knowledge: resolve(__dirname, 'src/knowledge.html'),
        littheory: resolve(__dirname, 'src/littheory.html'),
        'book-analysis': resolve(__dirname, 'src/book-analysis.html'),
        'book-excerpts': resolve(__dirname, 'src/book-excerpts.html'),
        'famous-books': resolve(__dirname, 'src/famous-books.html'),
        'famous-people': resolve(__dirname, 'src/famous-people.html'),
        'skill-evolution': resolve(__dirname, 'src/skill-evolution.html'),
        debate: resolve(__dirname, 'src/debate.html'),
        faq: resolve(__dirname, 'src/faq.html'),
        glossary: resolve(__dirname, 'src/glossary.html'),
        disclaimer: resolve(__dirname, 'src/disclaimer.html'),
        backup: resolve(__dirname, 'src/backup.html'),
        'ai-writing': resolve(__dirname, 'src/ai-writing.html'),
        '404': resolve(__dirname, 'src/404.html'),
      },
      output: {
        assetFileNames: (chunkInfo) => {
          // Don't hash manifest.json so PWA manifest path stays correct
          if (chunkInfo.name === 'manifest.json') {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'scripts/*.js',
          dest: '.'
        },
        {
          src: 'baidu_verify_codeva-hKe8DPIHeP.html',
          dest: '.'
        }
      ]
    }),
    {
      name: 'copy-root-files',
      closeBundle() {
        const rootFiles = ['service-worker.js', 'robots.txt', 'rss.xml', 'sitemap.xml', 'logo.svg']
        rootFiles.forEach(f => {
          const srcPath = join(__dirname, f)
          const destPath = join(__dirname, 'dist', f)
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath)
            console.log(`  ✓ copied ${f}`)
          }
        })
      }
    }
  ]
})
