import { getAllBlogPosts, getBlogPost, getSiteSettings } from '../../lib/content'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

export default function BlogPost({ post, settings }) {
  return (
    <>
      <Head>
        <title>{post.title} | Surya's Solar</title>
        <meta name="description" content={post.excerpt || `Read about ${post.title}`} />
        <link rel="icon" href="/images/surya-solar-logo.png" />
      </Head>
      <Header settings={settings} />

      <article className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main Content Column */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">

                {/* Back Link */}
                <Link
                  href="/blog"
                  className="inline-flex items-center text-gray-500 hover:text-solar-orange mb-6 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Blog
                </Link>

                {/* Post Header */}
                <header className="mb-8 border-b border-gray-100 pb-8">
                  {post.category && (
                    <span className="inline-block bg-orange-50 text-solar-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      {post.category}
                    </span>
                  )}

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                  </h1>

                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    {post.author && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">{post.author}</span>
                      </div>
                    )}
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                </header>

                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden mb-10 shadow-md">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                {/* Post Content */}
                <div
                  className="prose prose-lg max-w-none 
                    prose-headings:text-gray-900 prose-headings:font-bold prose-headings:leading-tight
                    prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-l-4 prose-h2:border-solar-orange prose-h2:pl-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-solar-orange prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:mb-2 prose-li:text-gray-700
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                    prose-blockquote:border-l-4 prose-blockquote:border-solar-orange prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-800
                    prose-img:rounded-xl prose-img:shadow-md prose-img:my-8"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-solar-orange to-orange-600 rounded-2xl shadow-lg p-8 text-white sticky top-24">
                <h3 className="text-2xl font-bold mb-4">Ready to Switch to Solar?</h3>
                <p className="mb-6 opacity-90 leading-relaxed">
                  Get a customized solar solution for your home. Save up to 90% on electricity bills!
                </p>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Free Site Visit
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Govt. Subsidy Support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    25 Years Warranty
                  </li>
                </ul>
                <Link
                  href="/#booking"
                  className="block w-full bg-white text-solar-orange text-center px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all transform hover:-translate-y-1 shadow-md"
                >
                  Book Free Consultation
                </Link>
              </div>

              {/* Share Card (Placeholder) */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
                <div className="flex gap-4">
                  <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </button>
                  <button className="p-2 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                  </button>
                  <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                    <span className="sr-only">WhatsApp</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </article>

      <Footer settings={settings} />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloat
        phoneNumber={settings.whatsapp || "917904369094"}
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
