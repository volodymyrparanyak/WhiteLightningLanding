import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Binary Classifier Library',
  description: 'Documentation and playground for the Binary Classifier library',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
          <Navigation />
          <main style={{ flex: '1 0 auto' }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}