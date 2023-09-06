import { MediaRenderer, useAddress, useContract, useNFT } from '@thirdweb-dev/react'
import React, { useMemo } from 'react'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"
import Link from 'next/link'

type Props = {
    id : number,
    image : string | null | undefined,
    title : string | number | null | undefined
}

const NftCard = (props: Props) => {
    const openCheckout = () => renderPaperCheckoutLink({
        checkoutLinkUrl: "https://withpaper.com/checkout/449ba759-858f-447c-b8bd-e0e32799a3e7",
    });

    const {contract} = useContract("0x92600a87C81b619a71ed9A8aDC82C2bA5E1E5c46","nft-drop")

    const { data:nft, isLoading, error } = useNFT(contract, props.id);
    const isPurchased = useMemo(()=> nft?.owner !== "0x0000000000000000000000000000000000000000",[nft] )

    
  


    return (
        <div className='flex flex-col items-center border border-gray-400 p-2 rounded-lg '>
            <Link href={`/artwork/${props.id}`}>
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