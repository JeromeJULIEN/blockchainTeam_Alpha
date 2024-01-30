'use client'
import { createContext, useContext, useState } from "react";



// Définir une interface pour le type de contexte
interface IUserContext {
    firebaseUser : any
    user: User | null; 
    updateUser: (newUser: User | null) => void;
    updateFirebaseUser:(newFirebaseUser : any | null)=> void
  }

// Créer un Context
const UserContext = createContext<IUserContext | null>(null);

// Exporter le hook personnalisé pour accéder au contexte
export const useUser = () => useContext(UserContext);

// exporter un provider pour permettre l'acces au contexte
export const UserProvider = ({ children }: {
    children: React.ReactNode
  }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<any | null>(null);

    const updateUser = (newUser : User | null) => {
        setUser(newUser);
        console.log("user updated in userProvider with : ", newUser);
        
    };

    const updateFirebaseUser = (newFirebaseUser : any | null) => {
        setFirebaseUser(newFirebaseUser);
        console.log("firebaseUser updated in userProvider with : ", newFirebaseUser);
    };

 

    const contextValue = {
        firebaseUser,
        user,
        updateUser,
        updateFirebaseUser
    };


    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};