'use client'
// libraries
import React, { useState } from 'react'
import Link from 'next/link'
import { ConnectWallet, useAddress } from '@thirdweb-dev/react'
// providers
import { useUser } from '@/app/providers/userProvider'
// components
import ConnectButton from './ConnectButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConnexionModal from './ConnexionModal/ConnexionModal'

type Props = { 
}

const Menu = (props: Props) => {
  const address = useAddress()
  //! :::: GLOBAL STATE ::::
  const userProvider = useUser()

  //! :::: LOCAL STATE ::::
  // connexion modal display management
  const [showConnexionModal, setShowConnexionModal] = useState(false)
  const openConnexionModal = () => setShowConnexionModal(true)
  const closeConnexionModal = () => setShowConnexionModal(false)


  return (
    <nav className="bg-black w-screen h-14 px-1 ">
      <ul className="flex h-full ">
        <div className='basis-1/4'></div>
        <div className='flex basis-1/2 justify-center items-center gap-20'>
            <Link className="text-white hover:underline cursor-pointer" href="/">Collections</Link>
            {/* {address && <Link className="text-white hover:underline cursor-pointer" href="/myGallery">My gallery</Link>} */}
            <Link className="text-white hover:underline cursor-pointer" href="/info">Info</Link>
        </div>
        <div className='basis-1/4 flex justify-end items-center  py-1 gap-2 relative'>
        {/* <ConnectWallet
          theme={"dark"}
          modalSize={'compact'}
          btnTitle='Connect'
          className='text-white border rounded-full border-white py-1'
        /> */}
          <ConnectButton openConnexionModal={openConnexionModal}/>
            
            
        </div>

      </ul>
      {showConnexionModal && <ConnexionModal onClose={closeConnexionModal}/>}
    </nav>
  )
}

export default Menu