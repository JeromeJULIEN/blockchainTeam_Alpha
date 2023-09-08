'use client'
import GalleryCard from '@/components/GalleryCard'
import NftCard from '@/components/NftCard'
import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import React, { useMemo } from 'react'
import { MoonLoader } from 'react-spinners'


type Props = {
  
}

const Collection = (props: Props) => {

  const {contract :contract1} = useContract("0x7Eb3C6edA89660FA56bf8b7C698bd08C98B9cf80","nft-drop")
  const {contract :contract2} = useContract("0x70D7D22354567f539211C2E97E192fe7a24A5f4E","nft-drop")
  const address = useAddress()

  const { data : ownedNft1, isLoading : isLoading1 } = useOwnedNFTs(contract1, address);
  const { data : ownedNft2, isLoading : isLoading2 } = useOwnedNFTs(contract2, address);

  let ownedNftNumber = 0
  if(ownedNft1 && ownedNft2) {
    ownedNftNumber = ownedNft1?.length + ownedNft2?.length
  }

  const setIsLoading = () => {
    if(!isLoading1 && !isLoading2) {
      return false
    } else {
      return true
    }
  }

  const isLoading = useMemo(()=> setIsLoading(),[isLoading1,isLoading2]  )

  return (
    <div className='w-full flex flex-col items-center'>
      {!isLoading && 
      <>
        <h2 className='my-4 border border-gray-500 p-2 rounded-full text-gray-500'>You're owning {ownedNftNumber} artworks</h2>
        <div className='flex flex-wrap w-full justify-center gap-10'>
          {ownedNft1?.map((nft,index)=>(
            <GalleryCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name}/>
          ))}
          {ownedNft2?.map((nft,index)=>(
            <GalleryCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name}/>
          ))}
        </div>
      </>
      }
      <MoonLoader
        className='my-10'
        loading={isLoading}
      />

    </div>
  )
}

export default Collection