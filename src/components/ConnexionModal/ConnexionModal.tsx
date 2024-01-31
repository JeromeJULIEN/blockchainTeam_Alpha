'use client'
// Libraries
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAddress, useEmbeddedWallet } from '@thirdweb-dev/react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import {toast} from 'react-toastify'
// providers
import { useFirebase } from '@/app/providers/firebaseProvider';
import { UserProvider, useUser } from '@/app/providers/userProvider';
// Components
import { AiOutlineMail } from "react-icons/ai";
import { IoMdCloseCircleOutline } from "react-icons/io";



type Props = {
    onClose : () => void,
}

const ConnexionModal = (props : Props) => {
    //! :::: LOCAL STATE ::::
    // Connexion mode display management
    const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
    const toggleAuthMode = () => {
        setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn');
    };

    // email form value management
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [JWT, setJWT] = useState<string>('');

    // event trigger
    const [walletCreated,setWalletCreated] = useState(false)
    const toggleWalletCreated = () => {
        setWalletCreated(!walletCreated)
    }

    //! :::: GLOBAL STATE ::::
    const userProvider = useUser()
    const {auth,db} = useFirebase()
    const address = useAddress()


    //! :::: AUTHENTICATION FUNCTIONS
    // firebase user creation with email
    const createUserWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("coucou from createUserWithEmail");
        
        try {
            if(auth && db){
                await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    setUser(user)
                    userProvider?.updateFirebaseUser(user)
                    console.log("user from createUserWithEmail =>", user);
                    // create the user doc in firebase
                    const usersRef = doc(db,"users",user.uid!) // get the potential doc of the user
                    getDoc(usersRef).then((doc)=>{
                        if(!doc.exists()){ // if doc not exist, create it
                            console.log("creation of the user doc in firebase");
                            setDoc(usersRef, {email: user.email, wallet: "", post_address:"",phone:"",createdAt: serverTimestamp()}, {merge: true})
                        }
                    }) 
                    // props.onClose()
                    toast.success(`Welcome ${email}`)
                    })            
                .catch((error) => {
                    const errorMessage : string = error.message;
                    toast.error(`${errorMessage}`)
                    console.error("error in createUserWithEmailAndPassword : ",errorMessage);  
                })
            } else {
                console.error("createUserWithEmail : firebase auth not initialized");
                return
            }
            // Gestion de la réussite de l'authentification
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                setError(error.message); // Affiche l'erreur
                toast.error(`${error.message}`)
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
                // props.onClose()
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
                        console.log("JWT setted ✅ =>",token);
                        
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
            if (JWT !== "") {
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
                setJWT("")
                props.onClose()
            }
        // }
    }, [JWT/*, connectEmbedded,userProvider?.user*/]);

    //! :::: FIRESTORE FUNCTIONS ::::
    useEffect(()=>{
        console.log("Enter in use effect to update user's wallet in firebase 1");
        console.log("address =>", address);
        console.log("firebaseUser =>", userProvider?.firebaseUser);
        
        if(address && userProvider?.firebaseUser ){
            console.log("Enter in use effect to update user's wallet in firebase 2");
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
          getDoc(userRef).then((doc)=>{
            if(doc.exists()){ // if doc exist, set the wallet address
                console.log("doc =>", doc);
                
                // setDoc(userRef, {wallet: ""}, {merge: true})
            }
        }) 
        //   await setDoc(userRef, user, {merge:true});
        //   console.log("User document created successfully");
        } catch (error) {
          console.error("Error creating user document:", error);
        }
    };
   

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
            <div className="bg-white p-5 rounded-xl flex flex-col items-center gap-4 w-3/4 shadow-xl">
                <div className='flex justify-center w-full'>
                    <div className='flex-grow'></div>
                    <h3 className='font-semibold text-xl pb-4'>Connect to the blockchain Team</h3> 
                    <div className='flex-grow'></div>
                    <button className='text-2xl' onClick={props.onClose}><IoMdCloseCircleOutline/></button>
                </div>
                {/* :::: SIGNUP :::: */}
                { authMode == 'signUp' &&
                <>
                {/* connect with google */}
                <button className='bg-black text-white flex justify-center items-center gap-4 rounded-full px-4 py-2 w-1/2' onClick={signInWithGoogle}>
                    <Image src='/logo_google.png' alt='google logo' width={25} height={25}/> 
                    Sign up with Google
                </button>
                {/* separator */}
                <div className="flex items-center justify-center w-full">
                    <div className="flex-grow  border-t border-gray-400"></div>
                    <span className="px-4 bg-white text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>
                {/* create with email */}
                <form className='flex flex-col justify-center items-center gap-4 w-1/2' onSubmit={createUserWithEmail}>
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='email'
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='password'
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='Confirm password'
                        type="password" 
                        id="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    {confirmPassword !== password && confirmPassword.length > 0 ? 
                    <p className='text-red-600 text-xs'>password are not the same</p>
                    :
                    <p className='text-white text-xs'>password are not the same</p>
                    }
                    <button className={`rounded-full px-4 py-2 w-full text-white ${password !== confirmPassword ? 'bg-gray-400' : 'bg-black'}`} type="submit" disabled={password !== confirmPassword}>
                        <div className='flex justify-center items-center gap-4'>
                            <p className='text-2xl'><AiOutlineMail/></p>
                            <p>Create an account</p>
                        </div>
                    </button>
                </form>
                <div className='text-gray-400 text-sm pt-4 w-1/2 text-center'>By signing up, your accepting the general terme and condition of the blockchain team</div>
                <div className='flex justify-center gap-2 text-gray-400 text-sm pt-4 w-1/2 text-center'>
                    <p>You already have an account ?</p>
                    <button onClick={toggleAuthMode} className='font-bold underline text-black'>Sign in</button>
                </div>
                </>
                }
                {/* :::: SIGNIN :::: */}
                {authMode == "signIn" && 
                <>
                {/* connect with google */}
                <button className='bg-black text-white flex justify-center items-center gap-4 rounded-full px-4 py-2 w-1/2' onClick={signInWithGoogle}>
                    <Image src='/logo_google.png' alt='google logo' width={25} height={25}/> 
                    Sign in with Google
                </button>
                {/* separator */}
                <div className="flex items-center justify-center w-full">
                    <div className="flex-grow  border-t border-gray-400"></div>
                    <span className="px-4 bg-white text-sm text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                </div>
                {/* connect with email */}
                <form className='flex flex-col justify-center items-center gap-4 w-1/2' onSubmit={connectUserWithEmail}>
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='email'
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        className='border border-black rounded-full px-4 py-2 w-full'
                        placeholder='password'
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button className="bg-black rounded-full text-white px-4 py-2 w-full" type="submit">
                        <div className='flex justify-center items-center gap-4'>
                            <p className='text-2xl'><AiOutlineMail/></p>
                            <p>Sign in</p>
                        </div>
                    </button>
                </form>
                <div className='flex justify-center gap-2 text-gray-400 text-sm pt-4 w-1/2 text-center'>
                    <p>You don&apos;t have an account ?</p>
                    <button onClick={toggleAuthMode} className='font-bold underline text-black' >Sign up</button>
                </div>
                </>
                }
            </div>
        </div>
  )
}

const signupView = () =>{
    
}

export default ConnexionModal