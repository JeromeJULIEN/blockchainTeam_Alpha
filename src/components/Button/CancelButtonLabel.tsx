import React from 'react'

type Props = {
    text : string
}

const CancelButtonLabel = (props: Props) => {
  return (
    <div className='bg-red-500 w-full rounded-full border border-red-500 text-white py-3 hover:bg-white  hover:text-red-500  transition ease-in-out' >{props.text}</div>
  )
}

export default CancelButtonLabel