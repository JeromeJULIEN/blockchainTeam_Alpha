'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useContractRead, useMetadata, useNFTs, useStorage } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react';
import { ContractMetadata, ThirdwebSDK } from "@thirdweb-dev/sdk";

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader, PuffLoader } from 'react-spinners';
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
  const typedData : any  = metadata
  // console.log(metadata);
  
  
  // get supply information
  const { data:claimedSupply, isLoading : isNftSupplyLoading} = useClaimedNFTSupply(contract);
  let availableSupply = 0
  if(nfts && claimedSupply) {
    availableSupply = nfts?.length - claimedSupply?.toNumber()
  }

  //get collection information
  const { contract : mainContract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data : collectionsList, isLoading : isLoadingCollection, error : collectionError } = useContractRead(mainContract, "getAllCollections"); 
  const collection : Collection = useMemo(()=> collectionsList?.find((collection : Collection)=> collection.contractAddress == props.params.contractAddress),[collectionsList]) 
  
  // get artist information
  const { data : artistsList, isLoading : isLoadingArtist, error : artistError } = useContractRead(mainContract, "getAllArtists"); 
  
  const artist : Artist = useMemo(()=> {
    if(collection !== undefined){
      return artistsList?.find((artist : Artist)=> artist.id.toString() == collection.artistId.toString())
    } 

  },[artistsList,collection])
  
  
  const setDisplay = () =>{
    if(artist !== undefined && !isNftSupplyLoading && !isNftsLoading && !isMetadataLoading && !isLoadingCollection && !isLoadingArtist) {
      return true
    } else {
      return false
    }
  }
  const display = useMemo(()=> setDisplay(),[artist,isNftSupplyLoading,isNftsLoading,isMetadataLoading,isLoadingCollection,isLoadingArtist])
  
  

  return (
    <div className='w-full flex flex-col items-center'>
      <PuffLoader
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
          <Link href={{
            pathname:`/artist/${artist.firstName.concat(artist.lastName)}`,
            query:{id:artist.id.toString()}
          }}>
            <button 
              className='flex items-center gap-2 mb-4 text-sm border px-2 py-1 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
            >by {artist.firstName} {artist.lastName} 
              <Image className='rounded-full bg-cover' src={artist.profilPicture} alt='artist picture' width={30} height={30} />
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

