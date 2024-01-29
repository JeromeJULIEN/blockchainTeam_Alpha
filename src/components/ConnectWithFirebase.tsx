'use client'
import initializeFirebaseClient from '@/app/lib/initFirebase';
import React, { useEffect, useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useEmbeddedWallet } from "@thirdweb-dev/react";
import { useUser } from '@/app/providers/userProvider';


    type Props = {}

const ConnectWithFirebase = (props: Props) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<any>();
    const [JWT, setJWT] = useState<string>('');


    const auth = getAuth();

    const userProvider = useUser()

    const createUserWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Gestion de la réussite de l'authentification
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                setError(error.message); // Affiche l'erreur
            }
        }
    };

    const connectUserWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            setUser(user)
            console.log("user from firestore =>", user);
            })            
            // ...
        } catch(error) {
            if (error instanceof Error) {
                console.error(error.message);
                setError(error.message); // Affiche l'erreur
            }
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken();
                    setJWT(token);
                    console.log("JWT setted =>", token);
                    
                } catch (error) {
                    console.error("Erreur lors de l'obtention du JWT", error);
                }
            }
        });
    
        return () => unsubscribe();
    }, []);

    const connectEmbedded = useEmbeddedWallet();

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

    //  Connexion au portefeuille intégré
     useEffect(() => {
        console.log("user from provider =>", userProvider?.user);
        // if (userProvider?.user != null) {
            if (JWT) {
                connectEmbedded.connect({
                    strategy: "jwt",
                    jwt: JWT,
                    encryptionKey:extractSubFromJwt(JWT)
                }).then(() => {
                    // Le portefeuille est maintenant connecté
                    console.log("wallet created");
                    
                })
                .catch((error) => {
                    console.log("JWT use by thirdweb =>", JWT);
                    
                    console.error("Error during embedded wallet connection : ", error);
                });
            }
        // }
    }, [JWT/*, connectEmbedded,userProvider?.user*/]);
    

    const handleGoogleLogin = async () => {
        await connectEmbedded.connect({
          strategy: "google",
        });
      };
    // onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       // User is signed in, see docs for a list of available properties
    //       // https://firebase.google.com/docs/reference/js/auth.user
    //       const uid = user.uid;
    //       setUser(user)
    //       // ...
    //     } else {
    //       // User is signed out
    //       // ...
    //     }
    // });

    async function getFirebaseJWT() {
        if (user) {
          return await user.getIdToken();
        } else {
          throw new Error("User is not authenticated");
        }
    }


    

    // const wallet = await connectEmbedded.connect({
    //     strategy: "jwt",
    //     getFirebaseJWT(),
    //     encryptionKey: process.env.REACT_APP_PUBLIC_THIRDWEB_ENCRIPTION_KEY!,
    //   });

    return (
        <div>
            <form onSubmit={connectUserWithEmail}>
                <div>
                <label htmlFor="email">Email</label>
                <input 
                    className='border border-black rounded-full px-2'
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                </div>
                <div>
                <label htmlFor="password">Mot de passe</label>
                <input 
                    className='border border-black rounded-full px-2'
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                </div>
                <button className="bg-black rounded-full text-white p-2" type="submit">Se connecter</button>
                <button className="bg-black rounded-full text-white p-2" onClick={handleGoogleLogin}>Sign in with google</button>

            </form>
            <form onSubmit={createUserWithEmail}>
                <button className="bg-black rounded-full text-white p-2" type="submit">Créer un compte</button>
            </form>
            {error && <p>Erreur : {error}</p>}
        </div>
    )
}

export default ConnectWithFirebase