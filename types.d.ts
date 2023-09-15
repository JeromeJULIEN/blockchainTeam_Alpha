type Collection = {
    id:number;
    contractAddress:string;
    checkoutLink : string;
  }

type ContractMetadata = {
description: string;
fee_recipient: string;
image: string;
merkle: Record<string, unknown>; // Cela indique que 'merkle' est un objet sans structure spécifique.
name: string;
seller_fee_basis_points: number;
symbol: string;
}