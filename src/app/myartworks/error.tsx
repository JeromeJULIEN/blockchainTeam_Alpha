'use client'

import Link from 'next/link'
import 
React from 'react'

type Props = {}

const ErrorMyArtworks = (props: Props) => {

    

    return (
        <Link href='/'>
        <div className='my-10 p-5 rounded-full border border-red-700 text-red-500 hover:bg-red-300 transition-all duration-300'>Something went wrong. Click to go back to home page</div>
        </Link>
    )
}

export default ErrorMyArtworks