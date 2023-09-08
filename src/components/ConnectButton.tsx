'use client'

import React, { useEffect, useState } from 'react'

import { PaperEmbeddedWalletSdk } from '@paperxyz/embedded-wallet-service-sdk'
import { paperWallet } from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";





type Props = {}

const ConnectButton = (props: Props) => {
// 
    return(
        <ConnectWallet
            btnTitle='Connect'
            className='text-white border rounded-full border-white py-1'
        />
    )
}

export default ConnectButton