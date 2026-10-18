import { getAllBlogPosts, getSiteSettings } from '../../lib/content'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useMemo, useState } from 'react'

const START_HERE = [
  { kind: 'Free tool', title: 'EB Bill Calculator', line: 'TNEB 2026 slab rates', href: '/eb-bill-calculator', tone: 'bg-blue-50 text-primary', icon: 'M9 7h6m-6 4h6m-6 4h3M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
  { kind: 'Free tool', title: 'Subsidy Checker', line: 'Up to ₹1 lakh, 30-second check', href: '/subsidy-eligibility', tone: 'bg-green-50 text-green-600', icon: 'M9 12l2 2 4-4m5.6-4.02A11.96 11.96 0 0112 2.94a11.96 11.96 0 01-8.6 3.04A12 12 0 003 9c0 5.6 3.83 10.3 9 11.62 5.17-1.33 9-6.03 9-11.62 0-1.04-.13-2.05-.38-3.02z' },
  { kind: 'Subsidy', title: 'PM Surya Ghar', line: '₹78,000 + ₹22,000 TN top-up', href: '/blog/2025-12-02-pm-surya-ghar-subsidy-tamil-nadu-puducherry', tone: 'bg-amber-50 text-amber-600', icon: 'M12 8c-1.66 0-3 .9-3 2s1.34 2 3 2 3 .9 3 2-1.34 2-3 2m0-8c1.11 0 2.08.4 2.6 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.4-2.6-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { kind: 'Price', title: 'Solar Price List', line: 'By brand and system size', href: '/blog/2026-10-17-solar-panel-price-list-tamil-nadu-by-brand', tone: 'bg-pink-50 text-accent', icon: 'M7 7h.01M7 3h5c.51 0 1.02.2 1.41.59l7 7a2 2 0 010 2.82l-7 7a2 2 0 01-2.82 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
  { kind: 'Compare', title: '3kW vs 5kW', line: 'Which size fits your bill', href: '/blog/2025-12-03-3kw-vs-5kw-solar-system-comparison', tone: 'bg-violet-50 text-violet-600', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { kind: 'Puducherry', title: 'Puducherry Cost', line: '1kW, 3kW and 5kW prices', href: '/blog/2026-05-08-solar-cost-puducherry-2026-1kw-3kw-5kw-price-guide', tone: 'bg-cyan-50 text-cyan-600', icon: 'M17.66 16.66L13.41 20.9a2 2 0 01-2.83 0l-4.24-4.24a8 8 0 1111.32 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
]

export default function BlogIndex({ posts, settings }) {
  const [active, setActive] = useState('All')
  const categories = useMemo(() => {
    const counts = {}
    posts.forEach((p) => { if (p.category) counts[p.category] = (counts[p.category] || 0) + 1 })
    return [['All', posts.length], ...Object.entries(counts).sort((a, b) => b[1] - a[1])]
  }, [posts])
  const shown = active === 'All' ? posts : posts.filter((p) => p.category === active)

  return (
    <>
      <Head>
        <title>Solar Guides Tamil Nadu 2026: Subsidy, Price & EB Bill</title>
        <meta name="description" content="Tamil Nadu solar guides from our engineers: ₹1 lakh subsidy, panel prices, units per day, TNEB slab rates, brand comparisons and Cuddalore install tips." />
        <link rel="canonical" href="https://www.suryassolar.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.suryassolar.com/blog" />
        <meta property="og:title" content="Solar Guides for Tamil Nadu Homes - Surya's Solar" />
        <meta property="og:description" content="Subsidy, prices, units per day, EB bills and brand comparisons, explained simply by our engineers." />
        <meta property="og:image" content="https://www.suryassolar.com/images/Banner_1_desktop.webp" />
      </Head>
      <Header settings={settings} />

      <main className="pb-16 bg-slate-50 min-h-screen">
        <section className="pt-24 lg:pt-28 pb-10 sm:pb-12 bg-gradient-to-b from-blue-50 via-blue-50/60 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-primary bg-primary-100 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {posts.length} guides · Written by our engineers
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight text-balance">
                Solar Guides for <span className="text-primary">Tamil Nadu</span> Homes
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 text-balance">
                Subsidy, prices, units per day and EB bills, explained in simple words for Cuddalore, Puducherry and all of Tamil Nadu.
              </p>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {START_HERE.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 transition-all"
                >
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.tone}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
                  </span>
                  <span className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">{item.kind}</span>
                  <span className="mt-0.5 font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">{item.title}</span>
                  <span className="mt-1 text-xs sm:text-sm text-slate-500 leading-snug">{item.line}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">All guides</h2>
            <span className="text-sm text-slate-500">{shown.length} {shown.length === 1 ? 'guide' : 'guides'}</span>
          </div>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mb-8 flex gap-2 overflow-x-auto sm:flex-wrap pb-1 [scrollbar-width:none]">
            {categories.map(([name, count]) => (
              <button
                key={name}
                type="button"
                onClick={(e) => {
                  setActive(name)
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${active === name ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-primary/40 hover:text-primary'}`}
              >
                {name} <span className={active === name ? 'text-blue-100' : 'text-slate-400'}>{count}</span>
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {shown.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-base sm:text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {shown.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {post.featuredImage && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        priority={index < 2}
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3">
                      {post.category && (
                        <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-solar-orange">{post.category}</span>
                      )}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight text-balance">
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
  // Serialize dates to strings and strip content body to reduce JSON size
  const serializedPosts = posts.map(post => {
    // eslint-disable-next-line no-unused-vars
    const { content, ...metaData } = post
    return {
      ...metaData,
      date: post.date ? post.date.toString() : new Date().toISOString()
    }
  })

  return {
    props: {
      posts: serializedPosts,
      settings,
    },
  }
}
