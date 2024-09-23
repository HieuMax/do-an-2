import React from 'react'
import Pagination from '../../utils/Pagination'

export const ListCard = ({props}) => {

  return (
    <div className='h-fullp-3'>
        <Pagination prop={props.data} parent={props.parent}/>
    </div>
  )
}
