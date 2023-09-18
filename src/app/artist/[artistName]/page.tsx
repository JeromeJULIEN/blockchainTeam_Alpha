'use client'
import { MediaRenderer, useStorage } from '@thirdweb-dev/react'
import { useRouter } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import { MoonLoader } from 'react-spinners'

type Props = {}

const ArtistPage = (props: Props) => {
    const router = useRouter()

    // get the artirst information
    const storage = useStorage()
    const [artist, setArtist] = useState<any>()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await storage?.downloadJSON("ipfs://QmYJtvmhnUZu5izu7jM6LNbiMk51n7r5B7eYMp8ga9nnso/artist1.json")
                setArtist(data)
            } catch (error) {
                console.error(error)
                return null
            }
        }
        fetchData()

    }, [])

    console.log("artist=>", artist);


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
                        back to the collection
                    </button>
                    <MediaRenderer className='rounded-full' src={artist.image} width={300} height={300} alt='artist picture' />
                    <h1 className='text-3xl font-bold'>{artist.name}</h1>
                    <p className=' md:w-2/3 text-center p-4 px-10 text-gray-600'>{artist.description}</p>

                </div>
            }
        </>
    )
}

export default ArtistPage