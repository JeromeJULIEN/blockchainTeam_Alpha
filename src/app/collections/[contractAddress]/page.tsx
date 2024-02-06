'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useContractRead, useMetadata, useNFTs, useStorage, useTotalCirculatingSupply, useTotalCount } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react';
import { ContractMetadata, ThirdwebSDK } from "@thirdweb-dev/sdk";

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader, PuffLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import artist1 from "../../../../data/artistData/artist1.json"
import Link from 'next/link';
import { useFetchArtistById, useFetchCollectionByContractAddress } from '@/app/lib/firebaseManager';
import { useFirebase } from '@/app/providers/firebaseProvider';

type Props = {
  params: {
    contractAddress: string;
  }
}

const Home =  (props: Props) => {
  
  
  
  //! :::: FIREBASE DATA ::::
  const { auth, db } = useFirebase()
  // All data from firebase are named by finishing with a "F"
  const [collectionF,setCollectionF] = useState<CollectionItem | null>(null)
  const [artistF,setArtistF]= useState<ArtistItem | null>(null)
  /// 1-Get the collection data from firebase (artist, nft checkout link)
  const fetchCollectionByContractAddress = useFetchCollectionByContractAddress()
  
  const handleGetCollectionByContractId = async() => {
    const result = await fetchCollectionByContractAddress(props.params.contractAddress)
    if (result !== null) {
      setCollectionF(result)
    }
  }
  useEffect(()=> {
    if (db){
      handleGetCollectionByContractId()
    }
  },[db])
  
  /// 2- Get the artist data from the collection's artist id
  const fetchArtistById = useFetchArtistById()
  const handleFetchArtistById = async()=>{
    if (collectionF !== null){
      const result = await fetchArtistById(collectionF.artist_id)
      setArtistF(result)
    }
  }
  useEffect(()=>{
    if(collectionF !== null) {
      handleFetchArtistById()
    }
  },[collectionF])

  // debug
  useEffect(()=> {
    if (collectionF !== null){
      console.log("collection fetched =>", collectionF); 
    }
    if (artistF !== null){
      console.log("artist fetched =>", artistF); 
    }
  }, [collectionF,artistF])

  const router = useRouter()
  
  //! :::: ONCHAIN DATA ::::
  // Get collection contract info
  const {contract} = useContract(props.params.contractAddress)
  // Get nfts of the contract
  const {data : nfts, isLoading : isNftsLoading,error} = useNFTs(contract)
  // Get the metadata of the contract
  const {data : metadata, isLoading : isMetadataLoading} = useMetadata(contract)
  const typedData : any  = metadata

  // get supply information
  const { data:nbOfIds, isLoading : isNftSupplyLoading, error :nftSupplyError} = useTotalCount(contract);
  // console.log("nfs =>", nfts);
  // console.log("metadata =>", typedData);  
  
  
  const setDisplay = () =>{
    if(artistF !== null && collectionF !== null && !isNftSupplyLoading && !isNftsLoading && !isMetadataLoading/* && !isLoadingCollection && !isLoadingArtist*/) {
      return true
    } else {
      return false
    }
  }
  const display = useMemo(()=> setDisplay(),[artistF,isNftSupplyLoading,isNftsLoading,isMetadataLoading/*,isLoadingCollection,isLoadingArtist*/])
  
  

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
            // pathname:`/artist/${artist.firstName.concat(artist.lastName)}`,
            pathname:`/artist/${artistF!.name}`,
            query:{id:artistF!.id.toString()}
          }}>
            <button 
              className='flex items-center gap-2 mb-4 text-sm border px-2 py-1 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
            >by {artistF!.name} 
              <Image className='rounded-full bg-cover' src={artistF!.picture_url} alt='artist picture' width={30} height={30} />
            </button>
          </Link>
          <p className=' md:w-2/3 text-center p-4 px-10 text-gray-600'>{typedData.description}</p>
          <h2 className=' border border-gray-500 my-10 p-2 rounded-full text-gray-500'>{nbOfIds?.toNumber()} Nfts to collect</h2>
          <div className='flex w-full flex-wrap justify-center gap-10'>
            {nfts?.map((nft,index)=>(
              <NftCard 
                key={index} 
                id={index} 
                image={nft.metadata.image} 
                title={nft.metadata.name} 
                contractAddress={props.params.contractAddress} 
                nftData={collectionF!.nfts[index]}
              />
            ))}
          </div>
        </>
      }
    </div>
  )
}

export default Home

