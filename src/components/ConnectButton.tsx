'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@/app/providers/userProvider';

import { PaperEmbeddedWalletSdk } from '@paperxyz/embedded-wallet-service-sdk'
import { paperWallet } from "@thirdweb-dev/react";
import { ConnectWallet,useAddress,useSDK, useAuth } from "@thirdweb-dev/react";
import initializeFirebaseClient from '@/app/lib/initFirebase';
import { signInWithCustomToken } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";





type Props = {}

const ConnectButton = (props: Props) => {
  const userProvider = useUser()
  
  const address = useAddress()
  console.log("address=>",address);
  
  // const thirdwebAuth = useAuth();
  const {auth,db} = initializeFirebaseClient()

  function convertDocumentDataToUser(data: any): User {
    return {
      wallet_address: data.wallet_address,
      post_address: data.post_address,
      telephone: data.telephone,
      email: data.email,
      createdAt: data.createdAt.toDate() // Convertir le timestamp Firestore en objet Date
    };
  }

  useEffect(() => {
    // Cette fonction sera appelée chaque fois que l'adresse change.
    const checkUserInFirestore = async () => {
      if (address) {
          const userRef = doc(db, "users", address);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
              // L'utilisateur n'existe pas encore, créez-le avec les champs requis.
              const newUser = {
                wallet_address: address.toString(),
                post_address: "",
                telephone: "",
                email: "",
                createdAt: new Date()
              };
              await setDoc(userRef, newUser, { merge: true });
              userProvider?.updateUser(newUser)
              console.log("Nouvel utilisateur créé avec l'adresse du portefeuille.");
          } else {
              // L'utilisateur existe déjà.
              const existingUser = convertDocumentDataToUser(userDoc.data());
              userProvider?.updateUser(existingUser)
              console.log("Utilisateur existant récupéré:", userProvider?.user);
          }
      }
    };

    // fonction pour supprimer le user du contexte à la déconnexion
    const logout = async() => {
      userProvider?.updateUser(null)
    }

    // si adresse définie, on recherche dans firestrore, sinon, on supprime le user du contexte
    if(address != undefined) {
      checkUserInFirestore();
    } else {
      logout()
    }
  }, [address, db]);
    // async function signIn() {
    //     // generate a login payoad to be sent to the server side of firebase
    //     const payload = await thirdwebAuth?.login()
    //     console.log("payload=>",payload);
        
    //     console.log("address=>",address);
        

    //     try {
    //         // Make a request to the API with the payload.
    //         const res = await fetch("/api/auth/login", {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({ payload }),
    //         });
        
    //         // Get the returned JWT token to use it to sign in with
    //         const { token } = await res.json();
        
    //         // Sign in with the token.
    //         const userCredential = await signInWithCustomToken(auth, token);
    //         // On success, we have access to the user object.
    //         const user = userCredential.user;
        
    //         // If this is a new user, we create a new document in the database.
    //         const usersRef = doc(db, "users", user.uid!);
    //         const userDoc = await getDoc(usersRef);
        
    //         if (!userDoc.exists()) {
    //           // User now has permission to update their own document outlined in the Firestore rules.
    //           setDoc(usersRef, { createdAt: serverTimestamp() }, { merge: true });
    //         }
    //       } catch (error) {
    //         console.error(error);
    //       }

    // }

    return(
      <ConnectWallet
          theme={"dark"}
          modalSize={'compact'}
          btnTitle='Connect'
          className='text-white border rounded-full border-white py-1'
      />
    )
}

export default ConnectButton