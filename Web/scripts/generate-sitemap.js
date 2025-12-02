const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SITE_URL = 'https://suryassolar.com';

// Static pages
const staticPages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.9 },
    { url: '/calc', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.8 },
    { url: '/blog', changefreq: 'weekly', priority: 0.7 },
];

function generateSitemap() {
    const contentDirectory = path.join(process.cwd(), 'content');
    const blogDirectory = path.join(contentDirectory, 'blog');

    let blogPosts = [];

    try {
        if (fs.existsSync(blogDirectory)) {
            const fileNames = fs.readdirSync(blogDirectory);
            blogPosts = fileNames
                .filter(fileName => fileName.endsWith('.md'))
                .map(fileName => {
                    const slug = fileName.replace(/\.md$/, '');
                    const filePath = path.join(blogDirectory, fileName);
                    const fileContents = fs.readFileSync(filePath, 'utf8');
                    const { data } = matter(fileContents);

                    let dateStr = new Date().toISOString().split('T')[0];
                    if (data.date) {
                        try {
                            dateStr = new Date(data.date).toISOString().split('T')[0];
                        } catch (e) {
                            console.warn(`Invalid date for ${slug}, using today.`);
                        }
                    }

                    return {
                        slug,
                        date: dateStr
                    };
                });
        }
    } catch (error) {
        console.error('Error reading blog posts:', error);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${blogPosts.map(post => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
    console.log(`Sitemap generated successfully with ${staticPages.length} static pages and ${blogPosts.length} blog posts.`);
}

generateSitemap();
