'use client'
import React from 'react'
import { useUser } from '../providers/userProvider'
import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react'
import { useCollections } from '../providers/collectionsProvider'
import NftCard from '@/components/NftCard'
import NftCardNew from '@/components/NftCardNew'

type Props = {}

const MyArworks = (props: Props) => {
    //! :::: PROVIDERS ::::
    const userProvider = useUser()
    const collectionsProvider = useCollections()
    const address = useAddress()

    console.log("collections from mt artworks =>", collectionsProvider?.collections);
    
    const {contract} = useContract(collectionsProvider?.collections![0].contract_address)
    const { data : nftsOwned, isLoading, error } = useOwnedNFTs(contract, address); 

    // console.log("myArtworks / nftsOwned =>",nftsOwned);
    



    return (
        <div>
            {nftsOwned?.map((nft, index)=>(
                <NftCardNew key={index} nftMetadata={nft.metadata}/>
            ))}
        </div>
    )
}

export default MyArworks