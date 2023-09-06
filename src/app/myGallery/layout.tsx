'use client'
import React from 'react'

type Props = {
    children : React.ReactNode
}

const CollectionLayout = (props: Props) => {


  return (
    <div>
        {props.children} 
    </div>
  )
}

export default CollectionLayout