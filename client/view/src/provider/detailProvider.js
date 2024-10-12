import React, { createContext } from 'react'

export const DepartmentInitialState = {
    departments: [],
    staffs: [],
}

export const DeparmentReducer = (state = DepartmentInitialState, action) => {
    switch(action.type) {
        case "LOADED_DEPARTMENTS": {
            return { ...state, departments: action.payload };
        }
        case "CHANGED_LIST": {
            return { ...state, staffs: action.payload}
        }
        default:
            return state;
    }
}

const DepartmentContext = React.createContext({
    state: DepartmentInitialState,
    dispatch: (action) => {},
});

export const FileContext = createContext()
export const MarkContext = createContext()

export default DepartmentContext;