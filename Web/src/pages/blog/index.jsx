import { getAllBlogPosts, getSiteSettings } from '../../lib/content'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

export default function BlogIndex({ posts, settings }) {
  return (
    <>
      <Head>
        <title>Solar Energy Blog | Surya's Solar</title>
        <meta name="description" content="Latest insights, tips, and updates about solar energy in Cuddalore and beyond." />

      </Head>
      <Header settings={settings} />

      <main className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Solar Energy Blog
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Latest insights, tips, and updates about solar energy in Cuddalore and beyond
            </p>
          </div>

          {/* Blog Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-base sm:text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {post.featuredImage && (
                    <div className="relative aspect-[2/1] w-full">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3">
                      {post.category && (
                        <span className="text-solar-orange font-medium">{post.category}</span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-sm sm:text-base text-gray-600 line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    <span className="text-solar-orange font-semibold hover:underline inline-flex items-center text-sm sm:text-base">
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloat
        phoneNumber={settings.whatsapp || "917904369094"}
        message="Hi! I have a question about your blog."
      />
    </>
  )
}

export async function getStaticProps() {
  const posts = getAllBlogPosts()
  const settings = getSiteSettings()

  // Serialize dates to strings
  const serializedPosts = posts.map(post => ({
    ...post,
    date: post.date ? post.date.toString() : new Date().toISOString()
  }))

  return {
    props: {
      posts: serializedPosts,
      settings,
    },
  }
}
