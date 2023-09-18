'use client'
import { MediaRenderer, useAddress, useContract,useContractRead,useNFT } from '@thirdweb-dev/react';
import React, { useMemo } from 'react'
import { MoonLoader } from 'react-spinners';
import { useRouter } from 'next/navigation'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"

type Props = {
  params: {
    contractAddress : string,
    artworkId: number
  }
}



const Artwork = (props: Props) => {
  const router = useRouter()
  const address = useAddress()

  // get the contract & nft information
  const {contract} = useContract(props.params.contractAddress,"nft-drop")
  const { data:nft, isLoading, error } = useNFT(contract, props.params.artworkId);
  const isPurchased = useMemo(()=> nft?.owner !== "0x0000000000000000000000000000000000000000",[nft] )
  const isTheOwner = useMemo(()=> nft?.owner === address,[nft,address] )
  const attributes : any = nft?.metadata.attributes

   // Get the main contract to retreive the good checkoutLink for this collection
   const {contract : mainContract} = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
   const { data : collectionsData, isLoading : getAllCollectionsLoading, error : getAllCollectionsError } = useContractRead(mainContract, "getAllCollections"); 
   const collection = useMemo(()=> collectionsData?.find((collection : Collection)=> collection.contractAddress == props.params.contractAddress),[mainContract]) 
   const openCheckout =() => {
       renderPaperCheckoutLink({
                       checkoutLinkUrl: collection.checkoutLink,
                   })
   }



  return (
    <div className='px-10 md:w-1/2 flex flex-col items-center m-4'>
      <MoonLoader
        className='my-10'
        loading={isLoading}
      />
      {!isLoading && 
      <>
        <button 
          className='my-10 border p-2 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
          onClick={()=>router.back()}  
        >back to the collection</button>
        <MediaRenderer src={nft?.metadata.image} alt='nft image' width='500' height='500'/>
        <h1 className='my-4 text-6xl font-semibold'>{nft?.metadata.name}</h1>
        <p className=' text-gray-500'>{nft?.metadata.description}</p>
        <div className='w-full flex  justify-start gap-4'>
          {attributes?.map((attribute:any,index:any)=>(
            <p className='my-10 border border-gray-500 py-1 px-2 rounded-full text-gray-500' key={index}>{attribute.trait_type} : {attribute.value}</p>
          ))}
        </div>
        {isPurchased ? 
                isTheOwner?
                    <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Your Nft</div> 
                    :
                    <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Sold</div> 
                :
                <button className='bg-black w-full rounded-full border border-black text-white py-3 font-bold hover:bg-white hover:font-extrabold hover:text-black  transition duration-400' onClick={openCheckout}>Buy</button> 
            }
      </>
      }
    </div>
  )
}

export default Artwork