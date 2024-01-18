'use client'

import React, { useEffect, useState } from 'react'

import { PaperEmbeddedWalletSdk } from '@paperxyz/embedded-wallet-service-sdk'
import { paperWallet } from "@thirdweb-dev/react";
import { ConnectWallet,useAddress,useSDK, useAuth } from "@thirdweb-dev/react";
import initializeFirebaseClient from '@/app/lib/initFirebase';
import { signInWithCustomToken } from "firebase/auth";
import { doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";





type Props = {}

const ConnectButton = (props: Props) => {
// 
    const address = useAddress()
    const thirdwebAuth = useAuth();
    const {auth,db} = initializeFirebaseClient()

    async function signIn() {
        // generate a login payoad to be sent to the server side of firebase
        const payload = await thirdwebAuth?.login()

        try {
            // Make a request to the API with the payload.
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ payload }),
            });
        
            // Get the returned JWT token to use it to sign in with
            const { token } = await res.json();
        
            // Sign in with the token.
            const userCredential = await signInWithCustomToken(auth, token);
            // On success, we have access to the user object.
            const user = userCredential.user;
        
            // If this is a new user, we create a new document in the database.
            const usersRef = doc(db, "users", user.uid!);
            const userDoc = await getDoc(usersRef);
        
            if (!userDoc.exists()) {
              // User now has permission to update their own document outlined in the Firestore rules.
              setDoc(usersRef, { createdAt: serverTimestamp() }, { merge: true });
            }
          } catch (error) {
            console.error(error);
          }

    }

    return(
        <>
            {
                address ? 
                <button onClick={()=> signIn()}>Connect</button>
                :
                <ConnectWallet
                    btnTitle='Connect'
                    className='text-white border rounded-full border-white py-1'
                />
            }
        </>
    )
}

export default ConnectButton