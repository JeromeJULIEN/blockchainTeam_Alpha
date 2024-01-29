'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import ConnectButton from './ConnectButton'
import { useAddress } from '@thirdweb-dev/react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConnexionModal from './ConnexionModal/ConnexionModal'

type Props = { 
}

const Menu = (props: Props) => {
  const address = useAddress()

  // connexion modal display management
  const [showConnexionModal, setShowConnexionModal] = useState(false)
  const openConnexionModal = () => setShowConnexionModal(true)
  const closeConnexionModal = () => setShowConnexionModal(false)


  return (
    <nav className="bg-black w-screen h-14 ">
      <ul className="flex h-full ">
        <div className='basis-1/4'></div>
        <div className='flex basis-1/2 justify-center items-center gap-20'>
            <Link className="text-white hover:underline cursor-pointer" href="/">Collections</Link>
            {/* {address && <Link className="text-white hover:underline cursor-pointer" href="/myGallery">My gallery</Link>} */}
            <Link className="text-white hover:underline cursor-pointer" href="/info">Info</Link>
        </div>
        <div className='basis-1/4 flex items-center py-1 gap-2'>
            <ConnectButton/>
            <p className='text-white' onClick={openConnexionModal}>Connect</p>
            <Link className="text-white hover:underline cursor-pointer" href="/myprofile"><AccountCircleIcon className='text-white text-5xl'/></Link>
            
        </div>

      </ul>
      {showConnexionModal && <ConnexionModal onClose={closeConnexionModal}/>}
    </nav>
  )
}

export default Menu