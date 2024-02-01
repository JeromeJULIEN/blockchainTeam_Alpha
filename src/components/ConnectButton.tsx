'use client'
import { useAddress } from '@thirdweb-dev/react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useUser } from '@/app/providers/userProvider';
import { concatAddress, concatEmail } from '@/app/utils/utilsFunctions';
import useOutsideClick from '@/app/utils/useOutsideClick';
import { useLogoutUser } from '@/app/lib/firebaseManager';
import  BeatLoader  from 'react-spinners/BeatLoader';


type Props = {
  openConnexionModal : () => void
}

const ConnectButton = (props: Props) => {
  //! :::: GLOBAL STATE ::::
  const address = useAddress()
  const userProvider = useUser()
  const logout = useLogoutUser()

  //! :::: LOCAL STATE ::::
  // menu display management
  const [isMenuDisplay,setIsMenuDisplay] = useState(false)
  const toggleMenuDisplay = () => {setIsMenuDisplay(!isMenuDisplay)}
  const hideMenu = () => {setIsMenuDisplay(false)}
  const menuRef = useRef<HTMLDivElement>(null)
  useOutsideClick(menuRef,hideMenu)
  // loading
  const [isLoading,setIsLoading] = useState(false)
  const [loaderColor,setColorLoader] = useState()

  //! :::: FUNCTIONS ::::
  // logout
  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
    setIsMenuDisplay(false)
  };

  //! :::: DEBUG ::::
  // useEffect(()=>{
  //   console.log("ConnectButton / useEffect / address :",address);
    
  // })

  const renderConnectedWidget = () => {
    return (
      <div className='flex flex-col justify-start gap-4 w-3/4 ' ref={menuRef}>
        <button onClick={toggleMenuDisplay}>
          <div className='flex justify-center items-center gap-2 border border-white rounded-full pl-2 pr-4 hover:bg-neutral-700 transition ease-in-out'>
            <AccountCircleIcon className='text-white text-3xl'/>
            <div className='flex flex-col items-start justify-center '>
              <p className='text-white text-sm'>{concatEmail(userProvider?.user?.email) }</p>
              <p className='text-gray-400 text-xs'>{concatAddress(address)}</p>
            </div>
          </div>
        </button> 
        {isMenuDisplay && 
        <div className='bg-black rounded-b-xl flex flex-col gap-1 p-2 absolute top-full w-3/4' >
          <Link href='/myprofile' className='border border-white text-white rounded-full px-2 hover:bg-neutral-700 transition ease-in-out text-center'>
            <button onClick={hideMenu} >My profile</button>
          </Link>
          <button className='border border-red-500 text-red-500 rounded-full px-2 hover:bg-red-900 transition ease-in-out' onClick={handleLogout}>
            {isLoading ? <BeatLoader/> : "log out"}
          </button>
        </div>
        }
      </div>
    )
  }

  return (
    <>
    { address ?
    renderConnectedWidget()
    // <Link className="text-white hover:underline cursor-pointer" href="/myprofile"><AccountCircleIcon className='text-white text-5xl'/></Link>
    :
    <button className='flex justify-center text-white items-center gap-2 border border-white rounded-full w-3/4 py-2 hover:bg-neutral-700 transition ease-in-out' onClick={props.openConnexionModal}>Connect</button>
    }
    </>
  )
}

export default ConnectButton

