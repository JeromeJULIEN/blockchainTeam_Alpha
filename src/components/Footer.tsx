import Link from 'next/link'
import React from 'react'

type Props = {}

const Footer = (props: Props) => {
  return (
    <div className='flex flex-col w-full p-4 pb-0 mt-auto'>
        <div className='flex justify-between p-2 border-t border-black text-xs'>
            <p>The blockchain team all right reserved - 2023 </p>
            <Link href="/termOfUse" className='hover:underline '>Terms of use</Link>
            <Link href="/privacy" className='hover:underline' >Privacy policy</Link>
        </div>
    </div>
  )
}

export default Footer