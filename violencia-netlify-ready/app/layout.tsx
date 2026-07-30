import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin', 'cyrillic'], variable: '--font-oswald' })
const jetbrains = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Violencia Resolver — GameSense',
  description:
    'Гибкая система предикта и коррекции противников для GameSense. Раздельные оружейные профили, адаптивный предикт и наглядные визуальные инструменты.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`bg-background ${inter.variable} ${oswald.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased">
        <Script id="reset-scroll" strategy="beforeInteractive">
          {`(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}if(location.hash){history.replaceState(null,'',location.pathname+location.search);}}catch(e){}})();`}
        </Script>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
