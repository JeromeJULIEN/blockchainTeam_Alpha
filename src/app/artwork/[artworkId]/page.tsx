'use client'
import { MediaRenderer, useAddress, useContract,useNFT } from '@thirdweb-dev/react';
import React, { useMemo } from 'react'
import { MoonLoader } from 'react-spinners';
import { useRouter } from 'next/navigation'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"

type Props = {
  params: {
    artworkId: number;
  };
}



const Artwork = (props: Props) => {
  const router = useRouter()
  const {contract} = useContract("0x92600a87C81b619a71ed9A8aDC82C2bA5E1E5c46","nft-drop")
  const { data:nft, isLoading, error } = useNFT(contract, props.params.artworkId);
  const address = useAddress()
  const isPurchased = useMemo(()=> nft?.owner !== "0x0000000000000000000000000000000000000000",[nft] )
  const isTheOwner = useMemo(()=> nft?.owner === address,[nft,address] )
  const attributes : any = nft?.metadata.attributes

  const openCheckout = () => renderPaperCheckoutLink({
    checkoutLinkUrl: "https://withpaper.com/checkout/449ba759-858f-447c-b8bd-e0e32799a3e7",
  });



  return (
    <div className='w-1/2 flex flex-col items-center m-4'>
      <button 
        className='my-4 border border-gray-500 p-2 rounded-full text-gray-500 hover:bg-black hover:text-white hover:border-black transition duration-300'
        onClick={()=>router.back()}  
      >back to gallery</button>
      <MoonLoader
        className='my-10'
        loading={isLoading}
      />
      {!isLoading && 
      <>
        <MediaRenderer src={nft?.metadata.image} alt='nft image' width='500' height='500'/>
        <h1 className='my-4 text-6xl font-semibold'>{nft?.metadata.name}</h1>
        <p className='mb-4 text-gray-500'>{nft?.metadata.description}</p>
        <div className='w-full flex  justify-start gap-4'>
          {attributes?.map((attribute:any,index:any)=>(
            <p className='my-4 border border-gray-500 py-1 px-2 rounded-full text-gray-500' key={index}>{attribute.trait_type} : {attribute.value}</p>
          ))}
        </div>
        {!isTheOwner &&
        <>
          {isPurchased ? 
            <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Sold</div> 
            :
            <button className='bg-black w-full rounded-full border border-black text-white py-3 font-bold hover:bg-white hover:font-extrabold hover:text-black  transition duration-400' onClick={openCheckout}>Buy</button> 
          }
        </>
        }
      </>
      }
    </div>
  )
}

export default Artwork