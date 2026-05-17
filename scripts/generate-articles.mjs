import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'
import { getArticleId } from './get-article-id.mjs'

const BASE_URL = 'https://corely.top'
const OG_IMAGE = BASE_URL + '/logo.svg'

function main() {
  console.log('Generating article pages...')

  const manifest = JSON.parse(readFileSync('data/manifest.json', 'utf-8'))

  // Read Vite-processed article.html as template (already has correct hashed asset paths)
  const templatePath = 'dist/article.html'
  if (!existsSync(templatePath)) {
    console.error('dist/article.html not found. Run vite build first.')
    process.exit(1)
  }
  const template = readFileSync(templatePath, 'utf-8')

  const outputDir = 'dist/article'
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  let count = 0
  for (const [filePath, meta] of Object.entries(manifest)) {
    const id = getArticleId(filePath, meta.dir)

    if (!existsSync(filePath)) {
      console.error(`  ⚠ 文件不存在: ${filePath} (ID: ${id})`)
      continue
    }

    const mdContent = readFileSync(filePath, 'utf-8')
    const htmlContent = marked.parse(mdContent)

    const cleanSummary = (meta.summary || meta.title || '').replace(/\*\*/g, '')
    const cleanDate = (meta.date || '').replace(/\s*\|.*$/, '').trim()

    const articleJson = JSON.stringify({
      id,
      title: meta.title,
      summary: cleanSummary,
      date: cleanDate,
      category: meta.category || meta.dir,
      dir: meta.dir
    })

    const jsonScript = `<script>window.__ARTICLE_DATA__ = ${articleJson};</script>`

    // Use replacer functions to handle $ characters in content
    const pageHtml = template
      .replace('{{ARTICLE_HTML}}', () => htmlContent)
      .replace('{{PAGE_TITLE}}', () => `${meta.title} | AI 萌新小窝`)
      .replace('{{PAGE_DESC}}', () => cleanSummary)
      .replace('{{PAGE_TAG}}', () => meta.category || meta.dir)
      .replace('{{PAGE_DATE}}', () => cleanDate)
      .replace('{{CANONICAL_URL}}', () => `${BASE_URL}/article.html?id=${id}`)
      .replaceAll('{{OG_IMAGE}}', () => OG_IMAGE)
      .replace('</body>', () => `${jsonScript}\n</body>`)

    writeFileSync(join(outputDir, `${id}.html`), pageHtml, 'utf-8')
    console.log(`  ✓ ${id}`)
    count++
  }

  console.log(`\nDone: ${count} articles generated`)
}

main()
