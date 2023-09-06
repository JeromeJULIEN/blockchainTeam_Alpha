'use client'

import React, { useEffect, useState } from 'react'

import { PaperEmbeddedWalletSdk } from '@paperxyz/embedded-wallet-service-sdk'
import { paperWallet } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";





type Props = {}

const ConnectButton = (props: Props) => {
//     const [paper, setPaper] = useState<any>();

//   useEffect(() => {
//     const paper = new PaperEmbeddedWalletSdk({
//       clientId: "9ce73078-abaf-499c-9e66-d6ff2f36c0a7",
//       chain: "Mumbai",
//     });
//     setPaper(paper);
//   }, []);


//   return (
//     <button 
//         className='bg-cyan-600 w-1/2 rounded-md my-1 hover:bg-cyan-400 text-white font-bold hover:font-extrabold'
//         onClick={() => paper.auth.loginWithPaperModal()}
//     >Connect</button>
//   )
    return(
        <ConnectWallet
            btnTitle='Connect'
            className='bg-cyan-400'
        />
    )
}

export default ConnectButton