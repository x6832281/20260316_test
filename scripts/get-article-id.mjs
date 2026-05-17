import { basename } from 'path'

const DIR_ID_PREFIX = {
  '萌新学习': 'newbie',
  '去AI味': 'deai',
  '拆书心得': 'book-analysis',
  '文学理论': 'littheory',
  '书摘文案': 'book-excerpt',
  '知识创作': 'knowledge',
  '精选项目': 'project'
}

export function getArticleId(filePath, dirName) {
  const fileName = basename(filePath)
  const prefixMatch = fileName.match(/^(\d{3})/)
  const prefix = prefixMatch ? prefixMatch[1] : '001'

  if (dirName === '知识创作') {
    return 'knowledge-' + fileName.replace('.md', '')
  } else if (dirName === '精选项目') {
    const slug = fileName.replace('.md', '').replace(prefix + '-', '')
    return 'project-' + prefix + '-' + slug
  } else {
    const idPrefix = DIR_ID_PREFIX[dirName] || dirName
    return idPrefix + '-' + prefix
  }
}
