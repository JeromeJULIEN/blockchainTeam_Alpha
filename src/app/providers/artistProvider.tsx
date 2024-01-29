'use client'
import { createContext, useContext, useState } from "react";



// Définir une interface pour le type de contexte
interface IArtistContext {
    artist: any | null; // Remplacez 'any' par un type plus spécifique si nécessaire
    updateArtist: (newArtist: any | null) => void;
  }

// Créer un Context
const ArtistContext = createContext<IArtistContext | null>(null);

// Exporter le hook personnalisé pour accéder au contexte
export const useArtist = () => useContext(ArtistContext);

// exporter un provider pour permettre l'acces au contexte
export const ArtistProvider = ({ children }: {
    children: React.ReactNode
  }) => {
    const [artist, setArtist] = useState<any | null>(null);

    const updateArtist = (newArtist : any | null) => {
        setArtist(newArtist);
        console.log("artist updated in userProvider with : ", newArtist);
        
    };

    const contextValue = {
        artist,
        updateArtist,
    };


    return (
        <ArtistContext.Provider value={contextValue}>
            {children}
        </ArtistContext.Provider>
    );
};