'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useNFTs } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader } from 'react-spinners';

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

  

  return (
    <div className='w-full flex flex-col items-center'>
      {!isNftsLoading && <h1 className='my-4'>The Blockchain Team artworks collection</h1>}
      {!isNftsLoading && <h2 className='mb-4 border border-gray-500 p-2 rounded-full text-gray-500'>{availableSupply}/{nfts?.length} Nfts remaining</h2>}
      <MoonLoader
        loading={isNftsLoading}
        className='my-10'
      />
      <div className='flex w-full flex-wrap justify-center gap-10'>
        {nfts?.map((nft,index)=>(
          <NftCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name}/>
          // <MediaRenderer key={nft.metadata.id} src={nft.metadata.image} alt='nft image'/>
        ))}

      </div>

    </div>
  )
}

export default Home

