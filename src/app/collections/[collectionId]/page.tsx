import React from 'react'


type Props = {
  params: {
    collectionId: string;
  };
}

const Collection = (props: Props) => {

  return (
    <p>This collection number {props.params.collectionId} is the best one !</p>
  )
}

export default Collection