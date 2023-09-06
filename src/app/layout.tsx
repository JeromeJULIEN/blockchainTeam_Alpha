import Menu from '@/components/Menu'
import './globals.css'
import type { Metadata } from 'next'
import { ThirdWebProvider } from './providers'
import { useAddress } from '@thirdweb-dev/react'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'The Blockchain Team',
  description: 'Make your art enter the web3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
     
        <body className='flex flex-col min-h-screen items-center'>
          <ThirdWebProvider>
            <Menu/>
            {children}
            <Footer/>
          </ThirdWebProvider>
        </body>
    </html>
  )
}
