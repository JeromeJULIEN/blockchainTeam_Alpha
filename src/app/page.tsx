'use client'
import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useContractRead, useNFTs } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useEffect } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useUser } from '@/app/providers/userProvider';

import React from 'react'
import NftCard from '@/components/NftCard';
import { MoonLoader, PuffLoader } from 'react-spinners';
import GalleryCard from '@/components/GalleryCard';
import CollectionCard from '@/components/CollectionCard';
import { BigNumber } from 'ethers';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from './providers/firebaseProvider';
import { useUpdateUserWalletInFirebase } from './lib/firebaseManager';

type Props = {}

const Home = (props: Props) => {
  // get the collections list from the main contract
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data: collectionsData, isLoading, error } = useContractRead(contract, "getAllCollections");

  const userProvider = useUser()
  const address = useAddress()
  const { auth, db } = useFirebase()

  //! :::: FIRESTORE FUNCTIONS ::::

  // useEffect to set the wallet address into firebase user doc
  useEffect(() => {
    if (address && userProvider?.firebaseUser) {
      console.log("Enter in useEffect from /");
      updateUserDocument(address)
      getUserFromFirebase()
    }
  }, [address, userProvider?.firebaseUser])

  const updateUserDocument = async (wallet: string) => {
    // console.log("enter in updateUserDocument");
    if (!db) {
      console.error("Database not initialized");
      return;
    }
    try {
      // Créer une référence de document pour un nouvel utilisateur
      const userRef = doc(db, 'users', userProvider?.firebaseUser.uid);
      // Stocker les informations de l'utilisateur dans Firestore
      getDoc(userRef).then((docSnapshot) => {
        // If doc exist, check if wallet address if already set ; if not, update
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data()
          if (userData.wallet !== wallet) {
            setDoc(userRef, { wallet: address }, { merge: true })
              .then(() => {
                console.log("wallet updated in user doc in firebase ✅");
              })
              .catch((error) => {
                console.error("Error updating wallet in user document:", error);
              });
          } else {
            console.log("No update needed, wallet is the same.");
          }
        }
      })
      //   await setDoc(userRef, user, {merge:true});
      //   console.log("User document created successfully");
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };

  const getUserFromFirebase = async () => {
    if (!db) {
      console.error("Database not initialized");
      return;
    } else {
      const userRef = doc(db, 'users', userProvider?.firebaseUser.uid);
      getDoc(userRef).then((docSnapshot: any) => {
        // If doc exist, check if wallet address if already set ; if not, update
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data()
          userProvider?.updateUser(userData)
          console.log("userData=>", userData);

        }
      })
    }
  }

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
            {collectionsData?.map((collection: Collection) => (
              <CollectionCard key={collection.id} address={collection.contractAddress} />
            ))}
          </div>
        </div>
      }
    </>
  )
}

export default Home

