import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const contentDirectory = path.join(process.cwd(), 'content')

/**
 * Load home page content from content/pages/home.md
 */
export function getHomeContent() {
  const filePath = path.join(contentDirectory, 'pages', 'home.md')

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    return data
  } catch (error) {
    console.error('Error loading home.md:', error)
    // Return default content if file doesn't exist
    return {
      heroSlides: [],
      stats: [],
      timelineSteps: [],
      partners: [],
      testimonials: []
    }
  }
}

/**
 * Load site settings from content/settings/general.md
 */
export function getSiteSettings() {
  const filePath = path.join(contentDirectory, 'settings', 'general.md')

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    return data
  } catch (error) {
    console.error('Error loading general.md:', error)
    // Return default settings if file doesn't exist
    return {
      siteTitle: "Surya's Solar",
      siteDescription: "Leading residential solar installation",
      phone: "+919876543210",
      email: "info@suryassolar.com"
    }
  }
}

/**
 * Load all blog posts from content/blog/
 */
export function getAllBlogPosts() {
  const blogDirectory = path.join(contentDirectory, 'blog')

  try {
    console.log('Scanning blog directory:', blogDirectory)
    const fileNames = fs.readdirSync(blogDirectory)
    console.log('Found files:', fileNames)
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '')
        const filePath = path.join(blogDirectory, fileName)
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          ...data,
          content
        }
      })
      // Sort by date (newest first)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    return posts
  } catch (error) {
    console.error('Error loading blog posts:', error)
    return []
  }
}

/**
 * Load a single blog post by slug
 */
export function getBlogPost(slug) {
  const filePath = path.join(contentDirectory, 'blog', `${slug}.md`)

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // Convert markdown to HTML
    const htmlContent = marked(content)

    return {
      slug,
      ...data,
      content: htmlContent
    }
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error)
    return null
  }
}
