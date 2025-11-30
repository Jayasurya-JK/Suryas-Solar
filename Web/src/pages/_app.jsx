import { Playfair_Display } from 'next/font/google'
import '../styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${playfair.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  )
}
