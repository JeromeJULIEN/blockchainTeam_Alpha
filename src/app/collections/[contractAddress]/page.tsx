'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useMetadata, useNFTs, useStorage } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react';
import { ContractMetadata, ThirdwebSDK } from "@thirdweb-dev/sdk";

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import artist1 from "../../../../data/artistData/artist1.json"
import Link from 'next/link';

type Props = {
  params: {
    contractAddress: string;
  }
}

const Home =  (props: Props) => {

  const router = useRouter()
 
  // Get collection contract info
  const {contract} = useContract(props.params.contractAddress,"nft-drop")
  const {data : nfts, isLoading : isNftsLoading,error} = useNFTs(contract)
  const {data : metadata, isLoading : isMetadataLoading} = useMetadata(contract)
  const typedData : any = metadata
  // console.log(metadata);
  
  
  // get supply information
  const { data:claimedSupply, isLoading : isNftSupplyLoading} = useClaimedNFTSupply(contract);
  let availableSupply = 0
  if(nfts && claimedSupply) {
    availableSupply = nfts?.length - claimedSupply?.toNumber()
  }


  // get artist information
  const storage = useStorage()
  const [artist,setArtist] = useState<any>()
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const data = await storage?.downloadJSON("ipfs://QmYJtvmhnUZu5izu7jM6LNbiMk51n7r5B7eYMp8ga9nnso/artist1.json")
        setArtist(data)
      } catch(error) {
        console.error(error)
        return null
      }
    }
   fetchData()
    
  },[])  

  const setDisplay = () =>{
    if(artist !== undefined && !isNftSupplyLoading && !isNftsLoading && !isMetadataLoading) {
      return true
    } else {
      return false
    }
  }
  const display = useMemo(()=> setDisplay(),[artist,isNftSupplyLoading,isNftsLoading,isMetadataLoading])
  
  

  return (
    <div className='w-full flex flex-col items-center'>
      <MoonLoader
        loading={!display}
        className='my-20'
      />
      {display && 
        <>
          <button 
            className='my-8 mt-8 border p-2 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
            onClick={()=>router.back()}  
          >back to all Collections</button>
          <h1 className='my-4 text-4xl font-semibold'>{typedData.name}</h1>
          <Link href='/artist/test'>
            <button 
              className='flex items-center gap-2 mb-4 text-sm border p-2 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
            >by {artist.name} 
              <MediaRenderer className='rounded-full bg-cover' src={artist.image} alt='nft image' width={50} height={20}/>
            </button>
          </Link>
          <p className=' md:w-2/3 text-center p-4 px-10 text-gray-600'>{typedData.description}</p>
          <h2 className=' border border-gray-500 my-10 p-2 rounded-full text-gray-500'>{availableSupply}/{nfts?.length} Nfts remaining</h2>
          <div className='flex w-full flex-wrap justify-center gap-10'>
            {nfts?.map((nft,index)=>(
              <NftCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name} contractAddress={props.params.contractAddress} />
            ))}
          </div>
        </>
      }
    </div>
  )
}

export default Home

