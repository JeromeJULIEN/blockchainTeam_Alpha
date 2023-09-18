import { MediaRenderer, useAddress, useContract, useContractRead, useNFT } from '@thirdweb-dev/react'
import React, { useMemo } from 'react'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"
import Link from 'next/link'
import { MoonLoader } from 'react-spinners'


type Props = {
    id : number,
    image : string | null | undefined,
    title : string | number | null | undefined
    contractAddress : string
}

const NftCard = (props: Props) => {
    
    // Get the collection contrat to display of the NFT and their selling status
    const address = useAddress()
    const {contract} = useContract(props.contractAddress,"nft-drop")
    const { data:nft, isLoading, error } = useNFT(contract, props.id);
    const isPurchased = useMemo(()=> nft?.owner !== "0x0000000000000000000000000000000000000000",[nft] )
    const isTheOwner = useMemo(()=> nft?.owner == address,[nft,address] )

    // Get the main contract to retreive the good checkoutLink for this collection
    const {contract : mainContract} = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    const { data : collectionsData, isLoading : getAllCollectionsLoading, error : getAllCollectionsError } = useContractRead(mainContract, "getAllCollections"); 
    const collection = useMemo(()=> collectionsData?.find((collection : Collection)=> collection.contractAddress == props.contractAddress),[mainContract]) 
    const openCheckout =() => {
        renderPaperCheckoutLink({
                        checkoutLinkUrl: collection.checkoutLink,
                    })
    }
    
    return (
        <>
        <MoonLoader
            loading={isLoading || getAllCollectionsLoading}
            className='my-20'
        />
        {!isLoading &&
        <div className='flex flex-col items-center border border-gray-400 p-2 rounded-lg '>
            <Link href={`/artwork/${props.contractAddress}/${props.id}`}>
                <MediaRenderer className='rounded-md hover:scale-105 transition duration-400 bg-cover ' key={props.id} src={props.image} alt='nft image'/>
            </Link>
            <h2 className='my-3 text-lg'>{props.title}</h2>
            {isPurchased ? 
                isTheOwner?
                    <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Your Nft</div> 
                    :
                    <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Sold</div> 
                :
                <button className='bg-black w-full rounded-full border border-black text-white py-3 font-bold hover:bg-white hover:font-extrabold hover:text-black  transition duration-400' onClick={openCheckout}>Buy</button> 
            }
        </div>
        }
        </>
    )
}

export default NftCard