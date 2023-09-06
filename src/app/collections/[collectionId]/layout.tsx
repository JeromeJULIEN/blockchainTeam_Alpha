'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

type Props = {
    params: {
        collectionId: string;
      };
    children : React.ReactNode
}

const MyGalleryLayout = (props: Props) => {
  const title = useSearchParams()
  return (
    <div>
        <h1>My NFT {props.params.collectionId}</h1>
        {props.children} 
    </div>
  )
}

export default MyGalleryLayout