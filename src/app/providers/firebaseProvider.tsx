'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Type definition
interface IFirebaseContext {
    auth: Auth | null;
    db: Firestore | null;
}

// Default type for the context
const FirebaseContext = createContext<IFirebaseContext | null>(null);

// Hook to call the context
export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (!context) {
        throw new Error('useFirebase doit être utilisé au sein d’un FirebaseProvider');
    }
    return context;
}
  
interface FirebaseProviderProps {
    children: React.ReactNode;
}
  
// Component Provider
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
const [firebase, setFirebase] = useState<IFirebaseContext>({ auth: null, db: null });

useEffect(() => {
    try{
        const app = initializeApp({
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID,
        });
    
        const db = getFirestore(app);
        const auth = getAuth(app);
    
        setFirebase({ db, auth });
        console.log("firebase db and auth initialized ✅");  
        console.log("auth => ",auth);
        console.log("db => ",db);
        
    } catch(error) {
        console.error("Error initializinf firebase : ",error);
        
    }
}, []);

return (
    <FirebaseContext.Provider value={firebase}>
        {children}
    </FirebaseContext.Provider>
);
};