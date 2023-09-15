'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useMetadata, useNFTs } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect } from 'react';
import { ContractMetadata, ThirdwebSDK } from "@thirdweb-dev/sdk";

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';

type Props = {
  params: {
    contractAddress: string;
  }
}

const Home = (props: Props) => {
 
  // Get collection contract info
  const {contract} = useContract(props.params.contractAddress,"nft-drop")
  const {data : nfts, isLoading : isNftsLoading,error} = useNFTs(contract)
  const {data : metadata} = useMetadata(contract)
  const typedData : any = metadata
  console.log(metadata);
  
  
  
  const { data:claimedSupply} = useClaimedNFTSupply(contract);
  let availableSupply = 0
  if(nfts && claimedSupply) {
    availableSupply = nfts?.length - claimedSupply?.toNumber()
  }

  const router = useRouter()
  

  return (
    <div className='w-full flex flex-col items-center'>
      {!isNftsLoading && 
        <>
          <button 
            className='my-4 mt-8 border p-2 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
            onClick={()=>router.back()}  
          >back to all Collections</button>
          <h1 className='my-4 text-4xl font-semibold'>{typedData.name}</h1>
          <p className=' md:w-2/3 text-center p-4 px-10 text-gray-600'>{typedData.description}</p>
          <h2 className=' border border-gray-500 my-10 p-2 rounded-full text-gray-500'>{availableSupply}/{nfts?.length} Nfts remaining</h2>
        </>
      }
      <MoonLoader
        loading={isNftsLoading}
        className='my-20'
      />
      {nfts && 
      <div className='flex w-full flex-wrap justify-center gap-10'>
        {nfts?.map((nft,index)=>(
          <NftCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name} contractAddress={props.params.contractAddress} />
        ))}
      </div>
      }
    </div>
  )
}

export default Home

