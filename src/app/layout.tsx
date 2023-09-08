import Menu from '@/components/Menu'
import './globals.css'
import type { Metadata } from 'next'
import { ThirdWebProvider } from './providers'
import { useAddress } from '@thirdweb-dev/react'
import Footer from '@/components/Footer'
import MenuMobile from '@/components/MenuMobile'
import { Suspense } from 'react'
import Loading from './loading'

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
            {/* <div className='z-50 visible md:collapse'>
              <MenuMobile/>
            </div> */}
            <div className='z-50 collapse md:visible'>
              <Menu/>
            </div>
            <Suspense fallback={<Loading />}>{children}</Suspense>
         
            <Footer/>
          </ThirdWebProvider>
        </body>
    </html>
  )
}
