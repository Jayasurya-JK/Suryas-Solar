import Script from 'next/script'
import Head from 'next/head'
import { Playfair_Display } from 'next/font/google'
import '../styles/globals.css'
import BookingPopup from '../components/BookingPopup'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${playfair.variable} font-sans`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-5C79VEBNMK"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-5C79VEBNMK');
        `}
      </Script>

      <Component {...pageProps} />
      <BookingPopup />
    </div>
  )
}
