import React, { Suspense, useReducer } from 'react'
import { ProjectList } from './ProjectList'
import ProjectsContext, { ProjectReducer, ProjectsInitialState } from '../../provider/projectProvider'
import { Loading } from '../../utils/Loading'

export const ProjectListProvider = () => {
  const [state, dispatch] = useReducer(
    ProjectReducer,
    ProjectsInitialState
  )

  
  return(
    <ProjectsContext.Provider value={{ state, dispatch }}>
        <Suspense fallback={<Loading/>}>
          <ProjectList/>

        </Suspense>
    </ProjectsContext.Provider>
  )
}
