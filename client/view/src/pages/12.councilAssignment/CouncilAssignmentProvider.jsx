import React from 'react'
import CouncilAssignment from './CouncilAssignment'
import ManagementContextProvider from '../../context/ManagementContext'

const CouncilAssignmentProvider = () => {

  return (
    <div>
        <ManagementContextProvider>
            <CouncilAssignment />
        </ManagementContextProvider>
    </div>
  )
}
export default CouncilAssignmentProvider
