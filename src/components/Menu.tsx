'use client'

import React from 'react'
import Link from 'next/link'
import ConnectButton from './ConnectButton'
import { useAddress } from '@thirdweb-dev/react'

type Props = { 
}

const Menu = (props: Props) => {
    const address = useAddress()

  return (
    <nav className="bg-black w-screen h-14 ">
      <ul className="flex h-full ">
        <div className='basis-1/4'></div>
        <div className='flex basis-1/2 justify-center items-center gap-20'>
            <Link className="text-white hover:underline cursor-pointer" href="/">Collections</Link>
            {/* {address && <Link className="text-white hover:underline cursor-pointer" href="/myGallery">My gallery</Link>} */}
            <Link className="text-white hover:underline cursor-pointer" href="/info">Info</Link>
        </div>
        <div className='basis-1/4 flex justify-center py-1'>
            {/* <ConnectButton/> */}
        </div>

      </ul>
    </nav>
  )
}

export default Menu