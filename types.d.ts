type Collection = {
    id:number;
    contractAddress:string;
    checkoutLink : string;
    artistId: number
  }

type ContractMetadataType = {
description: string;
fee_recipient: string;
image: string;
merkle: Record<string, unknown>; // Cela indique que 'merkle' est un objet sans structure spécifique.
name: string;
seller_fee_basis_points: number;
symbol: string;
}

type ArtistItem = {
    id:string;
    [key: string]: any;
}

// Définition de l'interface User
interface User {
  wallet: string; // L'adresse du portefeuille
  post_address: string;   // L'adresse postale, initialement une chaîne vide
  phone: string;      // Numéro de téléphone, initialement une chaîne vide
  email: string;          // Adresse e-mail, initialement une chaîne vide
  createdAt?: Date;       // Date de création, optionnelle
}

type CollectionItem = {
  id: string;
  [key: string]: any; 
};

type Attribute = {
  trait_type: string;
  value: string;
};

type NftMetadata = {
  // attributes: Attribute[] | null;
  // background_color?: string;
  // customAnimationUrl?: string;
  // customImage?: string;
  // description: string;
  // external_url: string;
  // id: string;
  // image: string;
  // name: string;
  // uri: string;
  [key: string]: any; 
};