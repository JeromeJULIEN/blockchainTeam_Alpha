import React from 'react'
import { renderPaperCheckoutLink } from "@paperxyz/js-client-sdk"

type Props = {
    isPurchased: boolean,
    isTheOwner: boolean,
    checkoutLink: string
}

const BuyButton = (props: Props) => {
    const openCheckout = () => {
        renderPaperCheckoutLink({
            checkoutLinkUrl: props.checkoutLink,
        })
    }

    return (
        <div className='w-full'>
            {props.isPurchased ?
                props.isTheOwner ?
                    <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Your Nft</div>
                    :
                    <div className='border border-gray-400 w-full rounded-full text-gray-400 py-3 font-bold text-center'>Sold</div>
                :
                <button className='bg-black w-full rounded-full border border-black text-white py-3 font-bold hover:bg-white hover:font-extrabold hover:text-black  transition duration-400' onClick={openCheckout}>Buy for 0.03 $</button>
            }
        </div>
    )
}

export default BuyButton