import React from 'react'
import CouncilList from './CouncilList'
import TeacherList from '../11.teacherList/TeacherList'
import ManagementContextProvider from '../../context/ManagementContext'


const CouncilListProvider = () => {

  return (
    <div>
        <ManagementContextProvider>
            <CouncilList />
        </ManagementContextProvider>
    </div>
  )
}
export default CouncilListProvider
