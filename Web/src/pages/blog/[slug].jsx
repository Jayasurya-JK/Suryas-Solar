import { getAllBlogPosts, getBlogPost, getSiteSettings } from '../../lib/content'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPost({ post, settings }) {
  return (
    <>
      <Header settings={settings} />
      
      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-solar-orange hover:underline mb-8"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-8">
            {post.category && (
              <span className="inline-block bg-solar-orange text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                {post.category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-gray-600">
              {post.author && (
                <span className="font-medium">{post.author}</span>
              )}
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </header>

          {/* Post Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-solar-orange prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-gradient-to-r from-solar-orange to-orange-600 rounded-lg text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Go Solar?</h2>
            <p className="text-xl mb-6 opacity-90">
              Book a free home visit and get a customized solar solution for your home
            </p>
            <Link
              href="/#booking"
              className="inline-block bg-white text-solar-orange px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Free Home Visit
            </Link>
          </div>
        </div>
      </article>

      <Footer settings={settings} />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppFloat 
        phoneNumber={settings.whatsapp || "919876543210"} 
        message="Hi! I read your blog and want to know more about solar installation."
      />
    </>
  )
}

export async function getStaticPaths() {
  const posts = getAllBlogPosts()
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = getBlogPost(params.slug)
  const settings = getSiteSettings()

  // Serialize date to string
  const serializedPost = {
    ...post,
    date: post.date ? post.date.toString() : new Date().toISOString()
  }

  return {
    props: {
      post: serializedPost,
      settings,
    },
  }
}
