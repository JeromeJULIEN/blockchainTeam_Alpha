'use client'
import { MediaRenderer, useContract, useContractRead, useStorage } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import React, { useEffect, useMemo, useState } from 'react'
import { MoonLoader } from 'react-spinners'

type Props = {}

const ArtistPage = (props: Props) => {
    const router = useRouter()

    // get the artistId from the routing
    const searchParams = useSearchParams()
    const artistIdRequested = searchParams?.get('id')

    // get artist information
    const { contract: mainContract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const { data: artistsList, isLoading: isLoadingArtist, error: artistError } = useContractRead(mainContract, "getAllArtists");
    const artist: Artist = useMemo(() => {
        if (artistIdRequested !== undefined && artistIdRequested !== null) {
            return artistsList?.find((artist: Artist) => artist.id.toString() == artistIdRequested.toString())
        }
    }, [artistIdRequested])


    return (
        <>
            <MoonLoader
                loading={artist === undefined}
                className='my-20'
            />
            {artist !== undefined &&
                <div className='flex flex-col gap-1 items-center'>
                    <button
                        className='my-8 mt-8 border p-2 rounded-full hover:text-black hover:bg-white bg-black text-white border-black transition duration-300'
                        onClick={() => router.back()}
                    >
                        back to the collection / artwork
                    </button>
                    <Image className='rounded-full' src={artist.profilPicture} width={300} height={300} alt='artist picture' />
                    <h1 className='text-3xl font-bold'>{artist.firstName} {artist.lastName}</h1>
                    <p className=' md:w-2/3 text-center p-4 px-10 text-gray-600'>{artist.description}</p>

                </div>
            }
        </>
    )
}

export default ArtistPage