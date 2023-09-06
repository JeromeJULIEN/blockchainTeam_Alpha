'use client'
import GalleryCard from '@/components/GalleryCard'
import NftCard from '@/components/NftCard'
import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import React from 'react'
import { MoonLoader } from 'react-spinners'


type Props = {
  
}

const Collection = (props: Props) => {

  const {contract} = useContract("0x92600a87C81b619a71ed9A8aDC82C2bA5E1E5c46","nft-drop")
  const address = useAddress()

  const { data : ownedNft, isLoading, error } = useOwnedNFTs(contract, address);

  return (
    <div className='w-full flex flex-col items-center'>
      {!isLoading && <h2 className='my-4 border border-gray-500 p-2 rounded-full text-gray-500'>Your {ownedNft?.length} artworks</h2>}
      <MoonLoader
        className='my-10'
        loading={isLoading}
      />
      <div className='flex flex-wrap w-full justify-center gap-10'>
        {ownedNft?.map((nft,index)=>(
          <GalleryCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name}/>
          // <MediaRenderer key={nft.metadata.id} src={nft.metadata.image} alt='nft image'/>
        ))}

      </div>

    </div>
  )
}

export default Collection