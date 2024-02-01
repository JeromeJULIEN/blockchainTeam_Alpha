'use client'
import { useCallback, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useUser } from '@/app/providers/userProvider';
import { useFirebase } from '@/app/providers/firebaseProvider';
import { useAddress, useDisconnect } from '@thirdweb-dev/react';
import { signOut } from 'firebase/auth';
import {toast} from 'react-toastify'
import { useRouter } from 'next/navigation'

// test2


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

// Logout user
export const useLogoutUser = () => {
    const disconnect = useDisconnect();
    const { auth } = useFirebase();
    const userProvider = useUser();
    const router = useRouter();

    const logoutUser = useCallback(async () => {
        // console.log("useLogoutUser / auth =>",auth);
        
        if (auth) {
            try {
                await signOut(auth); // firebase signout
                disconnect(); // thirdweb signout
                userProvider?.updateFirebaseUser(null); // local storage discard 
                console.log("Utilisateur déconnecté avec succès ✅👋");
                toast.success("User logged out");
                router.push("/");
            } catch (error) {
                console.error("Erreur lors de la tentative de déconnexion :", error);
                // Gérer les erreurs de déconnexion ici
            }
        } else {
            console.error("logoutUser : firebase auth not initialized");
        }
    }, []);

    return logoutUser;
};

export const useUpdateUserInFirebase = () => {
    const { db } = useFirebase();
    const userProvider = useUser();

    const updateUserInFirebase = useCallback(async (email : string | undefined, address : string | undefined, phone : string | undefined)=>{
        if (userProvider?.firebaseUser.uid && db !== null) {
            const userRef = doc(db, "users", userProvider.firebaseUser.uid);
    
            // Mise à jour de l'utilisateur dans Firestore
            await setDoc(userRef, { email: email, post_address: address, phone:phone }, { merge: true });
    
            // Mise à jour de l'utilisateur dans le contexte global
            const newUser = { ...userProvider.user! };
                if (email !== undefined) {
                    newUser.email = email;
                }
                if (address !== undefined) {
                    newUser.post_address = address;
                }
                if (phone !== undefined) {
                    newUser.phone = phone;
                }
            userProvider.updateUser(newUser);
            console.log("user updated in firebase and provider ✅");
            
        } else {
            console.error("saveChanges : user or db not defined");
        }

    },[])
    
    return updateUserInFirebase
}

export const useUpdateUserAddress = () => {
    const userProvider = useUser();
    const { db } = useFirebase();

    const updateUserAddress = async (wallet: string) => {
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
                setDoc(userRef, { wallet: wallet }, { merge: true })
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
    return updateUserAddress
}

export const useGetUserFromFirebase = () => {
    const userProvider = useUser();
    const { db } = useFirebase();
    
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

    return getUserFromFirebase
}

export const useFetchCollectionsByArtistId = () => {
    const { db } = useFirebase();

    const fetchCollectionsByArtistId = async():Promise<CollectionItem[]> => {
        if (!db) {
            console.error("Database not initialized");
            return [];
        } else {
            const collectionsRef = collection(db, "collections");
            const q = query(collectionsRef, where("artist_id", "==",process.env.NEXT_PUBLIC_ARTIST_FIREBASE_ID))

            try {
                const querySnapshot = await getDocs(q)
                const collections = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log("fetchCollectionsByArtistId result =>",collections);
                return collections
            } catch(error) {
                console.error("getArtistCollections error : ",error);
                return []
            }
        }
    }
    
    return fetchCollectionsByArtistId
}
