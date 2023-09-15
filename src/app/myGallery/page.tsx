'use client'
import GalleryCard from '@/components/GalleryCard'
import NftCard from '@/components/NftCard'
import { useAddress, useContract, useContractRead, useOwnedNFTs } from '@thirdweb-dev/react'
import React, { useEffect, useMemo, useState } from 'react'
import { MoonLoader } from 'react-spinners'


type Props = {
}

const Collection = (props: Props) => {

  // get the collections list from the main contract
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data : collectionsData, isLoading : getAllCollectionsLoading, error } = useContractRead(contract, "getAllCollections"); 
  const loading = true;
  const [ownedNft, setOwnedNft] = useState([]);
 

  // const concateNfts =()=>{
  //   collectionsData.map((collection : Collection)=>{
  //     const {contract} = useContract(collection.contractAddress,"nft-drop")
  //     const { data, isLoading } = useOwnedNFTs(contract, address);
  //     ownedNft.push(data)
  //     console.log(ownedNft);
      
  //   })
  // }

  // useEffect(()=>{
  //   concateNfts()
  // },[])
  
  const contract1Address = "0x7Eb3C6edA89660FA56bf8b7C698bd08C98B9cf80"
  const contract2Address = "0x70D7D22354567f539211C2E97E192fe7a24A5f4E"
  
  const {contract :contract1} = useContract(contract1Address,"nft-drop")
  const {contract :contract2} = useContract(contract2Address,"nft-drop")
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
            <GalleryCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name} contractAddress={contract1Address}/>
          ))}
          {ownedNft2?.map((nft,index)=>(
            <GalleryCard key={index} id={index} image={nft.metadata.image} title={nft.metadata.name} contractAddress={contract2Address}/>
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