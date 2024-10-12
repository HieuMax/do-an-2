import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { getAllCouncils, getAllTeachers, getAllDepartments, getCouncilMembers } from '../controller/5.councils/councils';
import { getAllProjects } from "../controller/1.projects/project";
import { getAllStudents } from "../controller/6.students/students";

export const ManagementContext = createContext();

const ManagementContextProvider = (prop) => {


    // Khai báo useState của Council
    const [councils, setCouncils] = useState([])
    const [teachers, setTeachers] = useState([])
    const [departmentsContext, setDepartmentsContext] = useState([])

    const [loadingCC, setLoadingCC] = useState(true);
    const [loadingButtonCC, setLoadingButtonCC] = useState(true);

    // Khai báo useState của CouncilAssignment
    const [loadingCA, setLoadingCA] = useState(true);
    const [loadingButtonCA, setLoadingButtonCA] = useState(true);
    const [projects, setProjects] = useState([])

    const [students, setStudents] = useState([])


    // Các controller của CouncilManagement
    const getCouncilsData = async () => {
        try {
            const response = await getAllCouncils();
            setLoadingButtonCC(true)
            if(response) {
                setCouncils(response)
            } else {
                console.log("error")
            }
            
        } catch (error) {
            console.log(error)
   
        } finally {
            setTimeout(() => {
                setLoadingCC(false);
                setLoadingButtonCC(false)

            }, 1200);
        }
    }

    const getTeachersData = async () => {
        try {
            const response = await getAllTeachers();
            if(response) {
                setTeachers(response)
                
            } else {
                console.log("error")
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    
    const getStudentsData = async () => {
        try {
            const response = await getAllStudents();
            if(response) {
                setStudents(response)
            } else {
                console.log("error")
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const getDepartmentsData = async () => {
        try {
            const response = await getAllDepartments();
            if (response) {
                setDepartmentsContext(response);

            } else {
                console.error("Error fetching departments");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCouncilsData();
        getTeachersData();
        getDepartmentsData();
        getStudentsData();
    },[])

    // Các controller của CouncilAssignment


    const getProjectsData = async () => {
        try {
            const response = await getAllProjects();
            setLoadingButtonCA(true)
            if(response) {
                setProjects(response.detai)
            } else {
                console.log("error")
            }
            
        } catch (error) {
            console.log(error)
   
        } finally {
            setTimeout(() => {
                setLoadingCA(false);
                setLoadingButtonCA(false)

            }, 1200);
        }
    }

    useEffect(() => {
        getProjectsData();

    },[])




    const value = {
        councils, teachers, departmentsContext,
        loadingCC, getCouncilsData, loadingButtonCC,

        projects, getProjectsData, students,
        loadingCA, loadingButtonCA
    }

    return(
        <ManagementContext.Provider value={value}>
            {prop.children}
        </ManagementContext.Provider>
    )
}

export default ManagementContextProvider