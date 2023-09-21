import React from 'react'
import { MoonLoader, PuffLoader, RotateLoader } from 'react-spinners'

type Props = {}

const Loading = (props: Props) => {
  return (
    <div> 
        <PuffLoader
            loading={true}
            className='my-20'
        />
    </div>
  )
}

export default Loading