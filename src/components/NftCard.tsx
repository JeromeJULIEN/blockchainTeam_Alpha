import { MediaRenderer, useAddress, useContract, useContractRead, useMetadata, useNFT, useNFTBalance, useTotalCirculatingSupply } from '@thirdweb-dev/react'
import React, { useEffect, useMemo, useState } from 'react'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"
import Link from 'next/link'
import { MoonLoader, PuffLoader } from 'react-spinners'
import BuyButton from '@/components/BuyButton'


type Props = {
    id : number,
    image : string | null | undefined,
    title : string | number | null | undefined
    contractAddress : string,
    nftData : any // containing checkout_link, supply, price to display
}

const NftCard = (props: Props) => {
    // ============================
    // GET DATA FROM COLELCTION AND NFT
    // ============================
    // Get the collection metadata
    const address = useAddress()
    const {contract} = useContract(props.contractAddress)
    const {data : metadata} = useMetadata(contract)
    const typedMetadata : any  = metadata
    const concatCollectionName = typedMetadata.name.replace(/\s+/g, '');
    // Get the nft quantity owned information
    const {data : qtyOwned} = useNFTBalance(contract, address,props.id)
    console.log("qty owned of id ", props.id, ": ", qtyOwned);
    
    
    //! ERC721 LOGIC => will be relevant with unique upply by nftId
    const { data:nft, isLoading, error } = useNFT(contract, props.id);
    const isPurchased = useMemo(()=> nft?.owner !== "0x0000000000000000000000000000000000000000",[nft] )
    const isTheOwner = useMemo(()=> nft?.owner == address,[nft,address] )
    // Get the main contract to retreive the good checkoutLink and price for this nft
    /*
    const {contract : mainContract} = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    const { data : nftsData, isLoading : isGetNftsLoading, error : getAllCollectionsError } = useContractRead(mainContract, "getNftsOfCollection",[props.collectionId]); 
    // set the price
    const [price,setPrice]= useState<number>()
    useEffect(()=>{
        if(nftsData !== undefined) {
            setPrice(nftsData[props.id].price.toNumber())
        }
    },[nftsData,props.id])
    */
    // Get the circulating supply of the nft
    const {data : circulatingSupply} = useContractRead(contract,"totalSupply",[props.id])
    // console.log("supply for id",props.id,"=>",circulatingSupply);
    

    return (
        <>
        <PuffLoader
            loading={isLoading /*|| isGetNftsLoading*/}
            className='my-20'
        />
        {!isLoading &&
        <div className='flex flex-col items-center border border-gray-400 p-2 rounded-lg '>
            <Link href={{
                pathname:`/artwork/${concatCollectionName}/${props.id}`,
                query:{contractAddress:props.contractAddress,checkoutLink:props.nftData.checkout_link}
            }}>
                <MediaRenderer className='rounded-md hover:scale-105 transition duration-400 bg-cover ' key={props.id} src={props.image} alt='nft image'/>
            </Link>
            <h2 className='my-3 text-lg'>{props.title}</h2>
          <h2 className='w-full text-center text-sm border-gray-500 mb-3  rounded-full text-gray-500'>{circulatingSupply?.toNumber()} on {props.nftData.supply} {circulatingSupply!.toNumber() <= 1 ? "Nft" : "Nfts" } minted</h2>
            <BuyButton 
                isPurchased={isPurchased} 
                isTheOwner={isTheOwner} 
                nftOwned={qtyOwned?.toNumber()} 
                checkoutLink={props.nftData.checkout_link} 
                nftId={props.id} 
                price={props.nftData.price}/>
           
        </div>
        }
        </>
    )
}

export default NftCard