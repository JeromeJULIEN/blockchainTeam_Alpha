'use client'
// libraries
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useContractRead, useNFTs } from '@thirdweb-dev/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useUser } from '@/app/providers/userProvider';
import { BigNumber } from 'ethers';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// providers
import { useFirebase } from './providers/firebaseProvider';
// custom hooks
import { useFetchCollectionsByArtistId, useGetUserFromFirebase, useUpdateUserAddress, useUpdateUserWalletInFirebase } from './lib/firebaseManager';

// components
import NftCard from '@/components/NftCard';
import { MoonLoader, PuffLoader } from 'react-spinners';
import GalleryCard from '@/components/GalleryCard';
import CollectionCard from '@/components/CollectionCard';

type Props = {}

const Home = (props: Props) => {
  // get the collections list from the main contract
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data: collectionsData, isLoading, error } = useContractRead(contract, "getAllCollections");

  const userProvider = useUser()
  const address = useAddress()
  const { auth, db } = useFirebase()
  const updateUserAddress = useUpdateUserAddress()
  const getUserFromFirebase = useGetUserFromFirebase()
  const fetchCollectionsByArtistId = useFetchCollectionsByArtistId()

  const [collectionsArray, setCollectionArray] = useState<CollectionItem[]>([])

  //! :::: FIRESTORE FUNCTIONS ::::
  // useEffect to set the wallet address into firebase user doc if needed
  // and get the user info from firebase
  useEffect(() => {
    if (address && userProvider?.firebaseUser && db) {
      console.log("Enter in useEffect from /");
      updateUserAddress(address)
      getUserFromFirebase()
    }
  }, [address, userProvider?.firebaseUser, db])

  // useEffect to get the collections of an artist
  const handlefetchCollectionsByArtistId = async()=> {
    const result = await fetchCollectionsByArtistId()
    setCollectionArray(result)
  }
  useEffect(()=> {
    if(db){
      handlefetchCollectionsByArtistId()
    }
  },[db])


  return (
    <>
      <PuffLoader
        loading={isLoading}
        className='my-20'
      />
      {!isLoading &&
        <div className='w-full flex flex-col items-center'>
          <h1 className='my-6 text-xl font-semibold'>The Blockchain Team artworks collections</h1>
          <p className='md:w-2/3 text-center py-4 text-gray-500'>Find the best artwork collections from top artist </p>
          <div className='flex w-full flex-wrap justify-center gap-10'>
            {/* {collectionsData?.map((collection: Collection) => (
              <CollectionCard key={collection.id} address={collection.contractAddress} />
            ))} */}
            {collectionsArray?.map(collection => (
              <CollectionCard key={collection.id} address={collection.contract_address} />
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default Home

