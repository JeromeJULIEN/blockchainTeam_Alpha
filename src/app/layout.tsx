import Menu from '@/components/Menu'
import './globals.css'
import type { Metadata } from 'next'
import { ThirdWebProvider } from '../app/providers/thirdwebProviders'
import { useAddress } from '@thirdweb-dev/react'
import Footer from '@/components/Footer'
import MenuMobile from '@/components/MenuMobile'
import { Suspense } from 'react'
import Loading from './loading'
import initializeFirebaseClient from './lib/initFirebase'
import { UserProvider } from './providers/userProvider'

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
            <UserProvider>
              <div className='z-50 block md:hidden'>
                <MenuMobile/>
              </div>
              <div className='z-50 hidden md:block'>
                <Menu/>
              </div>
              <Suspense fallback={<Loading />}>{children}</Suspense>
              <Footer/>
            </UserProvider>
          </ThirdWebProvider>
        </body>
    </html>
  )
}
