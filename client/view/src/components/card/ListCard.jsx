import React from 'react'
import Pagination from '../../utils/Pagination'

export const ListCard = ({props, currentPage, setCurrentPage, newsPerPage}) => {

  return (
    <div className='h-full'>
        <Pagination prop={props.data} parent={props.parent} currentPage={currentPage} setCurrentPage={setCurrentPage} newsPerPage={newsPerPage}/>
    </div>
  )
}
