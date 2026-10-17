// Validates blog posts: frontmatter, featured image, internal links, style, duplicate titles.
// Usage (from Web/): node .claude/skills/new-blog-post/scripts/check_posts.js [file.md ...]
// With no args, checks every post in content/blog.
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const BLOG = path.join('content', 'blog')
const REQUIRED = ['title', 'date', 'author', 'excerpt', 'featuredImage', 'category', 'tags']
const STATIC_ROUTES = new Set([
  '/', '/about', '/calc', '/subsidy-eligibility', '/contact', '/blog', '/privacy-policy', '/terms-conditions',
  '/systems/3kw-solar-system-with-subsidy', '/systems/5kw-solar-system-with-subsidy',
])
const cities = fs.readFileSync(path.join('src', 'lib', 'locationsData.js'), 'utf8')
for (const m of cities.matchAll(/^\s{2}([a-z-]+):\s*\{/gm)) STATIC_ROUTES.add(`/service-areas/${m[1]}`)

const allFiles = fs.readdirSync(BLOG).filter((f) => f.endsWith('.md'))
const slugs = new Set(allFiles.map((f) => f.replace(/\.md$/, '')))
const redirects = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).redirects.map((r) => r.source)
const targets = process.argv.slice(2).map((f) => path.basename(f))
const files = targets.length ? targets : allFiles

const titles = new Map()
for (const f of allFiles) {
  const t = String(matter(fs.readFileSync(path.join(BLOG, f), 'utf8')).data.title || '').trim().toLowerCase()
  titles.set(t, [...(titles.get(t) || []), f])
}

let errors = 0
let warnings = 0
for (const file of files) {
  const raw = fs.readFileSync(path.join(BLOG, file), 'utf8')
  const { data, content } = matter(raw)
  const err = (m) => { errors++; console.log(`ERROR ${file}: ${m}`) }
  const warn = (m) => { warnings++; console.log(`warn  ${file}: ${m}`) }

  if (!/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.md$/.test(file)) err('filename must be YYYY-MM-DD-lowercase-slug.md')
  for (const k of REQUIRED) if (!data[k] || (Array.isArray(data[k]) && !data[k].length)) err(`missing frontmatter "${k}"`)
  if (data.date && isNaN(new Date(data.date))) err(`invalid date "${data.date}"`)
  if (data.title && data.title.length > 65) warn(`title is ${data.title.length} chars (aim <= 60)`)
  if (data.excerpt && (data.excerpt.length < 100 || data.excerpt.length > 170)) warn(`excerpt is ${data.excerpt.length} chars (aim 120-160)`)
  if (data.featuredImage && !fs.existsSync(path.join('public', decodeURI(data.featuredImage)))) err(`featuredImage not found: public${data.featuredImage}`)
  if (data.faqs) {
    if (!Array.isArray(data.faqs) || data.faqs.some((q) => !q.question || !q.answer)) err('faqs must be a list of {question, answer}')
    if (!content.includes('<!-- COMPONENT: FAQ_SECTION -->')) warn('has faqs but no <!-- COMPONENT: FAQ_SECTION --> marker')
  }
  const dupes = titles.get(String(data.title || '').trim().toLowerCase()) || []
  if (dupes.length > 1) err(`duplicate title with ${dupes.filter((d) => d !== file).join(', ')}`)
  if (/[–—]/.test(raw)) warn('contains en/em dashes; site style uses plain hyphens')

  for (const m of content.matchAll(/\]\((\/[^)\s#?]*)[^)]*\)|href="(\/[^"#?]*)/g)) {
    let link = m[1] || m[2]
    if (link.startsWith('/images/')) {
      if (!fs.existsSync(path.join('public', decodeURI(link)))) err(`image not found: ${link}`)
      continue
    }
    if (link.length > 1 && link.endsWith('/')) { warn(`trailing slash causes a redirect: ${link}`); link = link.slice(0, -1) }
    const ok = STATIC_ROUTES.has(link) || (link.startsWith('/blog/') && slugs.has(link.slice(6)))
    if (!ok) (redirects.includes(link) ? warn : err)(`internal link ${redirects.includes(link) ? 'goes through a redirect' : 'is broken'}: ${link}`)
  }
  // Real words on the page: body text + rendered FAQ (tables' pipes and markup excluded)
  const faqText = Array.isArray(data.faqs) ? data.faqs.map((q) => `${q.question} ${q.answer}`).join(' ') : ''
  const words = `${content.replace(/<!--[\s\S]*?-->/g, ' ')} ${faqText}`.split(/\s+/).filter((w) => /[A-Za-z0-9₹஀-௿]/.test(w)).length
  if (words < 1000) warn(`only ${words} words of text on page (site minimum 1,000; see seo-specialist skill)`)
  const internal = (content.match(/\]\(\/|href="\//g) || []).length
  if (internal < 3) warn(`only ${internal} internal links (aim 3-6)`)
}

console.log(`\nChecked ${files.length} post(s): ${errors} error(s), ${warnings} warning(s).`)
process.exitCode = errors ? 1 : 0
