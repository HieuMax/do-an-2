import React from 'react'

export const ProjectsInitialState = {
    projects: [],
}

export const ProjectReducer = (state = ProjectsInitialState, action) => {
    switch(action.type) {
        case "LOADED_PROJECTS": {
            return { ...state, projects: action.payload };
        }
        default:
            return state;
    }
}

const ProjectsContext = React.createContext({
    state: ProjectsInitialState,
    dispatch: (action) => {},
});

export default ProjectsContext;