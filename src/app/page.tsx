'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useNFTs } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader } from 'react-spinners';
import GalleryCard from '@/components/GalleryCard';
import CollectionCard from '@/components/CollectionCard';

type Props = {}

const Home = (props: Props) => {


  const {contract} = useContract("0x92600a87C81b619a71ed9A8aDC82C2bA5E1E5c46","nft-drop")

  const {data : nfts, isLoading : isNftsLoading,error} = useNFTs(contract)
  console.log("nfts=>",nfts);
  const { data:claimedSupply} = useClaimedNFTSupply(contract);
  let availableSupply = 0
  if(nfts && claimedSupply) {
    availableSupply = nfts?.length - claimedSupply?.toNumber()
  }

  // const fetchData = async()=> {
  //   await fetch("api/todos")
  //   .then((res)=>{console.log(res.json())})
  // }

  

  return (
    <div className='w-full flex flex-col items-center'>
      {!isNftsLoading && 
      <>
        <h1 className='my-6 text-xl font-semibold'>The Blockchain Team artworks collections</h1>
        <p className='md:w-2/3 text-center py-4 text-gray-500'>Find the best artwork collections from top artist </p>
        <div className='flex w-full flex-wrap justify-center gap-10'>
            <CollectionCard address='0x7Eb3C6edA89660FA56bf8b7C698bd08C98B9cf80' /> 
            <CollectionCard address='0x70D7D22354567f539211C2E97E192fe7a24A5f4E' />
          {/* {nfts?.map((nft,index)=>(
            <NftCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name}/>
          ))} */}
        </div>
      </>
      }
      <MoonLoader
        loading={isNftsLoading}
        className='my-20'
      />
    </div>
  )
}

export default Home

