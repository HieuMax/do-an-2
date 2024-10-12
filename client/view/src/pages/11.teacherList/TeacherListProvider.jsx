import React from 'react'
import TeacherList from '../11.teacherList/TeacherList'
import ManagementContextProvider from '../../context/ManagementContext'


const TeacherListProvider = () => {

  return (
    <div>
        <ManagementContextProvider>

            <TeacherList />

        </ManagementContextProvider>
    </div>
  )
}
export default TeacherListProvider
