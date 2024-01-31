'use client'
import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useUser } from '@/app/providers/userProvider';
import { useFirebase } from '@/app/providers/firebaseProvider';
import { useAddress, useEmbeddedWallet } from '@thirdweb-dev/react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import {toast} from 'react-toastify'


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

export const useAuthFunctions = () => {
    const { auth, db } = useFirebase();
    const userProvider = useUser();
    const [user, setUser] = useState<any>(null);
    const [JWT, setJWT] = useState<string>('');
    const [error, setError] = useState<string>('');
    //! :::: AUTHENTICATION FUNCTIONS
    // firebase user creation with email
    const createUserWithEmail = async (email : string, password : string) => {
        try {
            if(auth){
                await createUserWithEmailAndPassword(auth, email, password);
                toast(`Welcome ${email}`)
            } else {
                console.error("createUserWithEmail : firebase auth not initialized");
                return
            }
            // Gestion de la réussite de l'authentification
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                setError(error.message); // Affiche l'erreur
                toast.error(`${error}`)
            }
        }
    };

    // firebase user connection with email
    const connectUserWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(auth){
                await signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUser(user)
                userProvider?.updateFirebaseUser(user)
                console.log("user from connectUserWithEmail =>", user);

                })            
                props.onClose()
                toast.success(`Welcome ${email}`)
            } else {
                console.error("connectUserWithEmail : firebase auth not initialized");
                return
            }
        } catch(error) {
            if (error instanceof Error) {
                console.error(error.message);
                setError(error.message); // Affiche l'erreur
                toast.error(`${error.message}`)
            }
        }
    }

    // firebase user connection/creation with google
    const signInWithGoogle = async () => {
        console.log("🟧 Starting signInWithGoogle");
        
        const provider = new GoogleAuthProvider();
        if(auth && db){
            await signInWithPopup(auth, provider)
                .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential?.accessToken;
                // The signed-in user info.
                const user : any = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                console.log("user from signInWithGoogle=>",user);
                setUser(user)
                userProvider?.updateFirebaseUser(user)    
                // create the user doc in firebase
                const usersRef = doc(db,"users",user.uid!) // get the potential doc of the user
                getDoc(usersRef).then((doc)=>{
                    if(!doc.exists()){ // if doc not exist, create it
                        setDoc(usersRef, {email: user.email, wallet: "", post_address:"",phone:"",createdAt: serverTimestamp()}, {merge: true})
                    }
                })       
                toast.success(`welcome ${user.email}`)
                // props.onClose()
                // ...
                }).catch((error) => {
                // Handle Errors here.
                // const errorCode = error.code;
                const errorMessage : string = error.message;
                // The email of the user's account used.
                // const email = error.customData.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                toast.error(`${errorMessage}`)
                // ...
                });
        } else {
            console.error("signInWithGoogle : firebase auth not initialized");
            return
        }
    };

    //! thirdweb embedded wallet management
    // store the JWT from firebase Auth
    useEffect(() => {
        if(auth){
            const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    try {
                        const token = await currentUser.getIdToken();
                        setJWT(token);
                        console.log("JWT setted ✅");
                        
                    } catch (error) {
                        console.error("Erreur lors de l'obtention du JWT", error);
                    }
                }
            });
            return () => unsubscribe();
        } else {
            console.error("useEffect to store JWT : firebase auth not initialized");
            return
        }
    
    }, []);

    // function to generate the encryption key
    const extractSubFromJwt = (jwt: string): string => {
        const parts = jwt.split(".");
        if (parts.length !== 3) {
          throw new Error("Invalid JWT format.");
        }
      
        const encodedPayload = parts[1];
        if (!encodedPayload) {
          throw new Error("Invalid JWT format.");
        }
        const decodedPayload = JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf8"));
        return decodedPayload.sub;
    };

    // embedded wallet generation
    const connectEmbedded = useEmbeddedWallet();

    // Connexion to thirdweb embedded wallet
    useEffect(() => {
        console.log("user from provider =>", userProvider?.user);
        // if (userProvider?.user != null) {
            if (JWT) {
                connectEmbedded.connect({
                    strategy: "jwt",
                    jwt: JWT,
                    encryptionKey:extractSubFromJwt(JWT)
                }).then(() => {
                    console.log("wallet created ✅ ");
                    // will trigger the useEffect with [address] dependency
                })
                .catch((error) => {
                    console.log("JWT use by thirdweb =>", JWT);
                    
                    console.error("Error during embedded wallet connection : ", error);
                });
            }
        // }
    }, [JWT/*, connectEmbedded,userProvider?.user*/]);

    return { 
        createUserWithEmail, 
        connectUserWithEmail, 
        signInWithGoogle, 
        user, 
        JWT
    };
}
