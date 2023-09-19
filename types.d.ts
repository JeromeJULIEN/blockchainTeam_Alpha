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

type Artist = {
    id:number;
    firstName : string;
    lastName : string;
    description : string;
    profilPicture : string;
}