import React from 'react'
import ManagementContextProvider from '../../context/ManagementContext'
import AddTeacher from './AddTeacher'


const AddTeacherProvider = ({isEdit}) => {

  return (
    <div>
        <ManagementContextProvider>

            <AddTeacher isEdit={isEdit}/>

        </ManagementContextProvider>
    </div>
  )
}
export default AddTeacherProvider
