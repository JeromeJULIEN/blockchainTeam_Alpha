import { MediaRenderer, useAddress, useContract, useNFT } from '@thirdweb-dev/react'
import React, { useMemo } from 'react'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"
import Link from 'next/link'

type Props = {
    id : number,
    image : string | null | undefined,
    title : string | number | null | undefined
    contractAddress : string
}

const NftCard = (props: Props) => {
    const openCheckout = () => {
        if((props.contractAddress) === "0x70D7D22354567f539211C2E97E192fe7a24A5f4E"){
            renderPaperCheckoutLink({
                checkoutLinkUrl: "https://withpaper.com/checkout/194a7e3a-b103-4d33-8a33-69a5f64dc307",
            })
        }
        if((props.contractAddress) === "0x7Eb3C6edA89660FA56bf8b7C698bd08C98B9cf80"){
            renderPaperCheckoutLink({
                checkoutLinkUrl: "https://withpaper.com/checkout/3152e471-95c4-401f-9567-167af40391e1",
        })

    }
    };

    const {contract} = useContract(props.contractAddress,"nft-drop")

    const { data:nft, isLoading, error } = useNFT(contract, props.id);
    const isPurchased = useMemo(()=> nft?.owner !== "0x0000000000000000000000000000000000000000",[nft] )

    
  


    return (
        <div className='flex flex-col items-center border border-gray-400 p-2 rounded-lg '>
            <Link href={`/artwork/${props.contractAddress}/${props.id}`}>
                <MediaRenderer className='rounded-md hover:scale-105 transition duration-400 ' key={props.id} src={props.image} alt='nft image'/>
            </Link>
            <h2 className='my-3 text-lg'>{props.title}</h2>
            {isPurchased ? 
                <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Sold</div> 
                :
                <button className='bg-black w-full rounded-full border border-black text-white py-3 font-bold hover:bg-white hover:font-extrabold hover:text-black  transition duration-400' onClick={openCheckout}>Buy</button> 
            }
        </div>
    )
}

export default NftCard