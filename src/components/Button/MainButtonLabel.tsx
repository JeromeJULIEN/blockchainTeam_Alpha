import React from 'react'

type Props = {
    text : string
}

const MainButtonLabel = (props: Props) => {
  return (
    <div className='bg-black w-full rounded-full border border-black text-white py-3 hover:bg-white  hover:text-black  transition ease-in-out' >{props.text}</div>
  )
}

export default MainButtonLabel