import React from 'react'

type Props = {}

const Info = (props: Props) => {
  return (
    <div className='p-4 flex flex-col gap-4'>
        <h1 className='text-xl font-bold my-4'>About the blockchain team</h1>
        <p className="font-light">The BlockChain Team guides through the Web3 journey by offering advices and workshops.</p>
            <p className="font-light">All certified by Alyra, the french blockchain school, we will provide the best service.</p>
            <p className="font-light">Get opportunities & applications on the Blockchain, risk and benefit management, as well as an NFT minting site for artists, galleries, e-commerce businesses, and professionals.</p>
            <p className="font-light">We offer a service and a product. Discover them!</p>
    </div>
  )
}

export default Info