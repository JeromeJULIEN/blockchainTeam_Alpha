'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useContractRead, useNFTs } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader } from 'react-spinners';
import GalleryCard from '@/components/GalleryCard';
import CollectionCard from '@/components/CollectionCard';
import { BigNumber } from 'ethers';

type Props = {}

const Home = (props: Props) => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data : collectionsData, isLoading, error } = useContractRead(contract, "getAllCollections"); 

  return (
    <>
    {!isLoading &&
    <div className='w-full flex flex-col items-center'>
        <h1 className='my-6 text-xl font-semibold'>The Blockchain Team artworks collections</h1>
        <p className='md:w-2/3 text-center py-4 text-gray-500'>Find the best artwork collections from top artist </p>
        <div className='flex w-full flex-wrap justify-center gap-10'>
          {collectionsData?.map((collection :Collection)=>(
            <CollectionCard key={collection.id} address={collection.contractAddress}/>
          ))}
        </div>
    </div>
    }
    </>
  )
}

export default Home

