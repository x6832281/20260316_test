import { readFileSync, existsSync } from 'fs'
import { getArticleId } from './get-article-id.mjs'

const errors = []

function main() {
  console.log('Running pre-build validation...')

  // 1. Load manifest
  if (!existsSync('data/manifest.json')) {
    errors.push('data/manifest.json not found')
    report()
  }
  const manifest = JSON.parse(readFileSync('data/manifest.json', 'utf-8'))

  // 2. Check all manifest file paths exist
  for (const [filePath] of Object.entries(manifest)) {
    if (!existsSync(filePath)) {
      errors.push(`manifest references missing file: ${filePath}`)
    }
  }

  // 3. Check for ID conflicts (two files generating same ID)
  const idMap = {}
  for (const [filePath, meta] of Object.entries(manifest)) {
    const id = getArticleId(filePath, meta.dir)
    if (idMap[id]) {
      errors.push(`ID conflict: "${id}" from "${filePath}" and "${idMap[id]}"`)
    }
    idMap[id] = filePath
  }

  // 4. Check required template exists
  if (!existsSync('src/article.html')) {
    errors.push('template missing: src/article.html')
  }

  report()
}

function report() {
  if (errors.length === 0) {
    console.log('✓ All checks passed')
    process.exit(0)
  } else {
    console.error(`\n✗ ${errors.length} validation error(s):`)
    errors.forEach(e => console.error(`  • ${e}`))
    process.exit(1)
  }
}

main()
