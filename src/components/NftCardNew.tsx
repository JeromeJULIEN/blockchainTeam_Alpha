import { MediaRenderer } from '@thirdweb-dev/react';
import React from 'react'

type Props = {
    nftMetadata : NftMetadata
}

const NftCardNew = (props: Props) => {
    console.log("nftCardNew / nftMetadata =>",props.nftMetadata);
    
  return (
    <div className='flex flex-col items-center border border-neutral-200 rounded-xl p-2 m-4 hover:shadow-xl transition ease-in-out '>
        <MediaRenderer className="rounded-md" src={props.nftMetadata.image} alt='nft image'/>
        <p className='py-4'>{props.nftMetadata.name}</p>
    </div>
  )
}

export default NftCardNew