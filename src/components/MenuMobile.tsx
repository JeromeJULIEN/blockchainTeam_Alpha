'use client'

import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useAddress } from '@thirdweb-dev/react';
import ConnectButton from './ConnectButton';

type Props = {}

const MenuMobile = (props: Props) => {
    const address = useAddress()

    const [isOpen, setIsOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-black w-screen h-14 ">
        <ul className="flex justify-between items-center h-full mx-2">
            <div>
                {isOpen? 
                    <button onClick={toggleMobileMenu}><CloseIcon className='text-white text-3xl'/> </button>
                    : 
                    <button onClick={toggleMobileMenu}><MenuIcon className='text-white text-3xl' /></button>
                }
            </div>
            <div className=' flex justify-center py-1' >
                <ConnectButton/>
            </div>

        </ul>
        {isOpen &&
        <ul>
            <div className='bg-black w-full text-white h-30 z-50 p-2 flex items-center'><Link onClick={toggleMobileMenu} href="/" className='w-full border-b border-white p-4 text-center text-3xl'>Home</Link> </div>
            <div className='bg-black w-full text-white h-30 z-50 p-2 flex items-center'><Link onClick={toggleMobileMenu} href="/myGallery" className='w-full border-b border-white p-4 text-center text-3xl'>My gallery</Link> </div>
            <div className='bg-black w-full text-white h-30 z-50 p-2 flex items-center'><Link onClick={toggleMobileMenu} href="/info" className='w-full border-b border-white p-4 text-center text-3xl'>Info</Link> </div>
        </ul>
        
        }
        </div>
    )
}

export default MenuMobile