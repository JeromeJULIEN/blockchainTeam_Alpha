'use client'
import React, { useMemo } from 'react'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"
import Link from 'next/link'
import { useContract, useContractRead } from '@thirdweb-dev/react'

type Props = {
    isPurchased: boolean,
    isTheOwner: boolean,
    nftOwned : number | undefined,
    checkoutLink: string,
    collectionId : number,
    nftId : number,
    price : number | undefined
}

const BuyButton = (props: Props) => {
    const openCheckout = () => {
        renderPaperCheckoutLink({
            checkoutLinkUrl: props.checkoutLink,
        })
    }
    const {contract : mainContract} = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    const { data : collectionsData, isLoading : isGetNftsLoading, error : getAllCollectionsError } = useContractRead(mainContract, "getNftsOfCollection",[props.collectionId]); 

    // const priceToDisplay = useMemo(()=> collectionsData[props.nftId].price,[collectionsData,props.nftId])
    // console.log("priceToDisplay=>",priceToDisplay);
    console.log("props nftOwned=>",props.nftOwned);
    
    

    return (
        <>
        {!isGetNftsLoading &&
            <div className='w-full'>
                {props.isPurchased || props.nftOwned! > 0?
                    props.isTheOwner || props.nftOwned! > 0 ?
                        <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Your Nft</div>
                        :
                        <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Sold</div>
                    :
                    // FRAME
                    // <button className='bg-black w-full rounded-full border border-black text-white py-3 font-bold hover:bg-white hover:font-extrabold hover:text-black  transition duration-400' onClick={openCheckout}>Buy for 0.03 $</button>
                    
                    //REDIRECTION
                    <Link href={props.checkoutLink}><button className='bg-black w-full rounded-full border border-black text-white py-3 font-bold hover:bg-white hover:font-extrabold hover:text-black  transition duration-400' /*onClick={openCheckout}*/>Mint for {props.price == 0 ? "free" : props.price}</button></Link>
                }
            </div>
        }
        </>
    )
}

export default BuyButton