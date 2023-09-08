import React from 'react'
import { MoonLoader } from 'react-spinners'

type Props = {}

const Loading = (props: Props) => {
  return (
    <div> 
        <MoonLoader
            loading={true}
            className='my-20'
        />
    </div>
  )
}

export default Loading