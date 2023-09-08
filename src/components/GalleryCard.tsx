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

const GalleryCard = (props: Props) => {
    
    return (
        <div className='flex flex-col items-center border border-gray-400 p-2 rounded-lg'>
            <Link href={`/artwork/${props.contractAddress}/${props.id}`}>
                <MediaRenderer className='rounded-md hover:scale-105 transition duration-400' key={props.id} src={props.image} alt='nft image'/>
            </Link>
            <h2 className='my-3 text-lg'>{props.title}</h2>
        </div>
    )
}

export default GalleryCard