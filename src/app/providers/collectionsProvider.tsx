'use client'
import { createContext, useContext, useState } from "react";



// Définir une interface pour le type de contexte
interface ICollectionsContext {
    collections: CollectionItem[] | null; // Remplacer 'any' par un type plus spécifique si nécessaire
    updateCollections: (newCollections : CollectionItem[] | null) => void;
  }

// Créer un Context
const CollectionsContext = createContext<ICollectionsContext | null>(null);

// Exporter le hook personnalisé pour accéder au contexte
export const useCollections = () => useContext(CollectionsContext);

// exporter un provider pour permettre l'acces au contexte
export const CollectionsProvider = ({ children }: {
    children: React.ReactNode
  }) => {
    const [collections, setCollections] = useState<CollectionItem[] | null>(null);

    const updateCollections = (newCollections : CollectionItem[] | null) => {
        setCollections(newCollections);
        console.log("collections updated in collectionsProvider with : ", newCollections);
        
    };

    const contextValue = {
        collections,
        updateCollections,
    };


    return (
        <CollectionsContext.Provider value={contextValue}>
            {children}
        </CollectionsContext.Provider>
    );
};