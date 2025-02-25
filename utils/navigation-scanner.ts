import fs from 'fs'
import path from 'path'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import type { File } from '@babel/types'

interface Section {
  id: string
  title: string
  content: string
}

interface PageInfo {
  path: string
  title: string
  description?: string
  content: string
  sections: Section[]
}

export async function scanPages(): Promise<Record<string, PageInfo>> {
  const pagesDir = path.join(process.cwd(), 'app')
  const pages: Record<string, PageInfo> = {}

  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory() && !item.startsWith('_') && !item.startsWith('.')) {
        scanDirectory(fullPath)
      } else if (item === 'page.tsx') {
        const relativePath = dir.replace(pagesDir, '').replace(/\\/g, '/')
        const routePath = relativePath || '/'
        
        const pageInfo = analyzePageFile(fullPath)
        if (pageInfo) {
          pages[routePath] = {
            path: routePath,
            ...pageInfo
          }
        }
      }
    }
  }

  scanDirectory(pagesDir)
  return pages
}

function analyzePageFile(filePath: string): { title: string; description?: string; content: string; sections: Section[] } | null {
  const content = fs.readFileSync(filePath, 'utf-8')
  let title = ''
  let description = ''
  const sections: Section[] = []

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    })

    traverse(ast as unknown as File, {
      // Look for title in metadata exports
      ExportNamedDeclaration(path) {
        const declaration = path.node.declaration
        if (declaration?.type === 'VariableDeclaration') {
          const declarator = declaration.declarations[0]
          if (declarator?.id?.type === 'Identifier' && declarator.id.name === 'metadata') {
            const properties = (declarator.init as any)?.properties || []
            const titleProp = properties.find((p: any) => p.key.name === 'title')
            if (titleProp) {
              title = titleProp.value.value
            }
            const descProp = properties.find((p: any) => p.key.name === 'description')
            if (descProp) {
              description = descProp.value.value
            }
          }
        }
      },
      // Look for section IDs in the JSX
      JSXElement(path) {
        const element = path.node
        const openingElement = element.openingElement
        
        if (openingElement.attributes.some(attr => 
          attr.type === 'JSXAttribute' && 
          attr.name.name === 'id'
        )) {
          const idAttr = openingElement.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'id'
          ) as any
          
          const titleAttr = openingElement.attributes.find(
            attr => attr.type === 'JSXAttribute' && attr.name.name === 'title'
          ) as any

          if (idAttr?.value?.value) {
            sections.push({
              id: idAttr.value.value,
              title: titleAttr?.value?.value || idAttr.value.value,
              content: extractTextContent(content)
            })
          }
        }
      }
    })

    return { title, description, content: extractTextContent(content), sections }
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error)
    return null
  }
}

// Extract text content from TSX/JSX removing JSX tags and code
function extractTextContent(content: string): string {
  // Remove imports and exports
  content = content.replace(/import[^;]*;/g, '')
                  .replace(/export[^}]*}/g, '')
  
  // Extract string literals from arrays and objects
  const strings = content.match(/['"`][^'"`]*['"`]/g) || []
  
  // Extract text from JSX
  const jsxText = content.replace(/<[^>]*>/g, ' ')
                        .replace(/{[^}]*}/g, ' ')
                        .replace(/\s+/g, ' ')
  
  // Combine and clean up
  return [...strings, jsxText]
    .join(' ')
    .replace(/['"`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
