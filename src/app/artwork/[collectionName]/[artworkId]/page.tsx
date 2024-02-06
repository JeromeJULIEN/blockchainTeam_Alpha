'use client'
import { MediaRenderer, useAddress, useContract,useContractRead,useNFT, useNFTBalance } from '@thirdweb-dev/react';
import React, { useEffect, useMemo, useState } from 'react'
import { MoonLoader, PuffLoader, RotateLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link';
import Image from 'next/image';
import BuyButton from '@/components/BuyButton';
import { useFirebase } from '@/app/providers/firebaseProvider';
import { useFetchArtistById, useFetchCollectionByContractAddress } from '@/app/lib/firebaseManager';

type Props = {
  params: {
    collectionName : string,
    artworkId: number
  }
}

const Artwork = (props: Props) => {
  const router = useRouter()
  const address = useAddress()
  const [isLoading,setIsLoading] = useState(true)

  // get the contract address from the routing
  const searchParams = useSearchParams()
  const contractAddress = searchParams?.get('contractAddress')
  const checkoutLink = searchParams?.get('checkoutLink')!

  //! :::: FIREBASE DATA ::::
  const { auth, db } = useFirebase()
  // All data from firebase are named by finishing with a "F"
  const [collectionF,setCollectionF] = useState<CollectionItem | null>(null)
  const [artistF,setArtistF]= useState<ArtistItem | null>(null)
  /// 1-Get the collection data from firebase (artist, nft checkout link)
  const fetchCollectionByContractAddress = useFetchCollectionByContractAddress()
  
  const handleGetCollectionByContractId = async() => {
    if (contractAddress) {
      const result = await fetchCollectionByContractAddress(contractAddress)
      if (result !== null) {
        setCollectionF(result)
      }
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
      setIsLoading(false)
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

  //! :::: ONCHAIN DATA ::::
  // get the contract & nft information
  const {contract} = useContract(contractAddress)
  const { data:nft, isLoading : isNftLoading, error } = useNFT(contract, props.params.artworkId);
  
  
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
  // Get the nft quantity owned information
  const {data : qtyOwned} = useNFTBalance(contract, address,props.params.artworkId)
  

  return (
    <>
    <PuffLoader
        className='my-10'
        loading={isNftLoading || isGetNftsLoading}
      />
      {(!isLoading) && 
      <div className='px-10 md:w-1/2 flex flex-col items-center m-4'>
        <button 
          className='my-10 border p-2 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
          onClick={()=>router.back()}  
        >back to the collection</button>
        <MediaRenderer src={nft?.metadata.image} alt='nft image' width='500' height='500'/>
        <h1 className='my-4 text-6xl font-semibold'>{nft?.metadata.name}</h1>
        { artistF !== null &&
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
        }
        <p className=' text-gray-500'>{nft?.metadata.description}</p>
        <div className='w-full flex  justify-start gap-4'>
          {attributes?.map((attribute:any,index:any)=>(
            <p className='my-10 border border-gray-500 py-1 px-2 rounded-full text-gray-500' key={index}>{attribute.trait_type} : {attribute.value}</p>
          ))}
        </div>
        <BuyButton isPurchased={isPurchased} isTheOwner={isTheOwner} nftOwned={qtyOwned?.toNumber()} checkoutLink={checkoutLink}nftId={props.params.artworkId} price={price}/>


      </div>
      }
      
    </>
  )
}

export default Artwork