'use client'
import { useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useUser } from '@/app/providers/userProvider';
import { useFirebase } from '@/app/providers/firebaseProvider';
import { useAddress } from '@thirdweb-dev/react';

export const useUpdateUserWalletInFirebase = () => {
    const userProvider = useUser();
    const { db } = useFirebase();
    const address = useAddress();

    // useEffect to set the wallet address into firebase user doc
    useEffect(()=>{
        if(address && userProvider?.firebaseUser){
            updateUserDocument(address)
        }
    },[address, userProvider?.firebaseUser ])

    const updateUserDocument = async (wallet: string) => {
    if (!db) {
        console.error("Database not initialized");
        return;
    }
    
    try {
        // Créer une référence de document pour un nouvel utilisateur
        const userRef = doc(db, 'users', userProvider?.firebaseUser.uid);
        
        // Stocker les informations de l'utilisateur dans Firestore
        getDoc(userRef).then((docSnapshot)=>{
        if(docSnapshot.exists()){ 
            const userData = docSnapshot.data()
            // If doc exist, check if wallet address if already set ; if not, update
            if (userData.wallet !== address && userData.wallet !== "") {
                setDoc(userRef, {wallet: address}, {merge: true})
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
};
