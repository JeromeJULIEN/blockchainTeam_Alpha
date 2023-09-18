'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

type Props = {
    params: {
        collectionId: string;
      };
    children : React.ReactNode
}

const CollectionLayout = (props: Props) => {
  const title = useSearchParams()
  return (
    <div>
        {props.children} 
    </div>
  )
}

export default CollectionLayout