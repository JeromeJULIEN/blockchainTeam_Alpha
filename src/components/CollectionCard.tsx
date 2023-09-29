import { MediaRenderer, useAddress, useClaimedNFTSupply, useContract, useContractRead, useMetadata, useNFT, useTotalCirculatingSupply, useTotalCount, useUnclaimedNFTSupply } from '@thirdweb-dev/react'
import React, { useMemo } from 'react'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"
import Link from 'next/link'
import { MoonLoader, PuffLoader } from 'react-spinners'

type Props = {
    address : string
}


const CollectionCard = (props: Props) => {
    // get contract information
    const { contract } = useContract(props.address);
    // get number of id created
    const {data : nbOfId} = useTotalCount(contract)
    let supply : number = 0
    if(nbOfId !== undefined ) {
        supply = nbOfId?.toNumber()
    }
    
    // get contract metadata
    const {data, isLoading} = useMetadata(contract)
    const typedData : any = data
    
    
    return (
        <>
            {!isLoading &&
                <div className='flex flex-col items-center border border-gray-400 p-2 rounded-lg'>
                    <Link href={`/collections/${props.address}`}>
                        <MediaRenderer className='rounded-md hover:scale-105 transition duration-400' key={props.address} src={typedData.image} alt='nft image'/>
                    </Link>
                    <h2 className='my-3 text-xl font-semibold'>{typedData.name}</h2>
                    <h3 className='text-gray-500'>{supply} artworks </h3>
                </div>
            }
            <PuffLoader
                loading={isLoading}
                className='my-20'
            />
        </>
    )
}

export default CollectionCard