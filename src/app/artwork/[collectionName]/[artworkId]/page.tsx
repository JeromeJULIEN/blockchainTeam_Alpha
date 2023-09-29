'use client'
import { MediaRenderer, useAddress, useContract,useContractRead,useNFT } from '@thirdweb-dev/react';
import React, { useEffect, useMemo, useState } from 'react'
import { MoonLoader, PuffLoader, RotateLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import BuyButton from '@/components/BuyButton';

type Props = {
  params: {
    collectionName : string,
    artworkId: number
  }
}

const Artwork = (props: Props) => {
  const router = useRouter()
  const address = useAddress()

  // get the contract address from the routing
  const searchParams = useSearchParams()
  const contractAddress = searchParams?.get('contractAddress')
  const checkoutLink = searchParams?.get('checkoutLink')!


  // get the contract & nft information
  const {contract} = useContract(contractAddress)
  const { data:nft, isLoading, error } = useNFT(contract, props.params.artworkId);
  
  
  const isPurchased = useMemo(()=> nft?.owner !== "0x0000000000000000000000000000000000000000",[nft] )
  const isTheOwner = useMemo(()=> nft?.owner === address,[nft,address] )
  const attributes : any = nft?.metadata.attributes

  // Get the main contract to retreive the good checkoutLink for this nft
  const {contract : mainContract} = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
  const { data : collectionsData, isLoading : isGetCollectionsLoading, error : getAllCollectionsError } = useContractRead(mainContract, "getAllCollections"); 
  const collection = useMemo(()=> collectionsData?.find((collection : Collection)=> collection.contractAddress == contractAddress),[collectionsData,contractAddress]) 
   
  const { data : nftsData, isLoading : isGetNftsLoading, error : getNftsError } = useContractRead(mainContract, "getNftsOfCollection",[collection !== undefined ? collection.id : 0]); 
  // set the price
  const [price,setPrice]= useState<number>()
  useEffect(()=>{
      if(nftsData !== undefined) {
          setPrice(nftsData[props.params.artworkId].price.toNumber())
      }
  },[nftsData,props.params.artworkId])

  

  
 

  // get artist information
  const { data : artistsList, isLoading : isLoadingArtist, error : artistError } = useContractRead(mainContract, "getAllArtists"); 
  
  const artist : Artist = useMemo(()=> {
    if(collection !== undefined){
      return artistsList?.find((artist : Artist)=> artist.id.toString() == collection.artistId.toString())
    } 

  },[artistsList,collection])


  return (
    <>
    <PuffLoader
        className='my-10'
        loading={isLoading || isGetNftsLoading}
      />
      {(artist != undefined && !isLoading) && 
      <div className='px-10 md:w-1/2 flex flex-col items-center m-4'>
        <button 
          className='my-10 border p-2 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
          onClick={()=>router.back()}  
        >back to the collection</button>
        <MediaRenderer src={nft?.metadata.image} alt='nft image' width='500' height='500'/>
        <h1 className='my-4 text-6xl font-semibold'>{nft?.metadata.name}</h1>
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
        <p className=' text-gray-500'>{nft?.metadata.description}</p>
        <div className='w-full flex  justify-start gap-4'>
          {attributes?.map((attribute:any,index:any)=>(
            <p className='my-10 border border-gray-500 py-1 px-2 rounded-full text-gray-500' key={index}>{attribute.trait_type} : {attribute.value}</p>
          ))}
        </div>
        <BuyButton isPurchased={isPurchased} isTheOwner={isTheOwner} checkoutLink={checkoutLink} collectionId={collection.id} nftId={props.params.artworkId} price={price}/>


      </div>
      }
      
    </>
  )
}

export default Artwork