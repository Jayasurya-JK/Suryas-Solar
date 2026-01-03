import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="google-site-verification" content="255DK9iGvCPS82OfNdCcaBPwlSzihp9_sXGriHuOAPY" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F97316" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
