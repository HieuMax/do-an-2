import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { getAllCouncils, getAllTeachers, getAllDepartments, getCouncilMembers } from '../controller/5.councils/councils';
import { getAllProjects, getProjectById, getProjectsByStatus } from "../controller/1.projects/project";
import { getAllStudents } from "../controller/6.students/students";
import { updateTeacher, addNewTeacher } from "../controller/2.mentors/mentors";

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

    // Khai báo useState của add,edit teacher
    const [loadingButtonAddTeacher, setLoadingButtonAddTeacher] = useState(false);
    const [loadingButtonEditTeacher, setLoadingButtonEditTeacher] = useState(false);

    // Các controller của CouncilManagement
    const getCouncilsData = async (sort) => {
        try {
            const response = await getAllCouncils();
            setLoadingButtonCC(true)
            if(response) {
                const sortedCouncils = response.sort((a, b) => {
                    const numA = parseInt(a.hoidongid.replace('HD', '')); 
                    const numB = parseInt(b.hoidongid.replace('HD', '')); 
                    if(sort == 'asc'){
                        return numA - numB; // Sắp xếp tăng dần
                    }
                    return numB - numA; // Sắp xếp giảm dần
                });
                setCouncils(sortedCouncils)
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

    const addTeacherContext = async (formData) => {
        try {
            await addNewTeacher(formData);
            setLoadingButtonAddTeacher(true)     
            
        } catch (error) {
            console.log(error)
   
        } finally {
            setTimeout(() => {
                setLoadingButtonAddTeacher(false)
                toast.success('Thêm giảng viên thành công');

            }, 1200);
        }
    }

    const updateTeacherContext = async (id, formData) => {
        try {
            await updateTeacher(id, formData);
            setLoadingButtonEditTeacher(true)
            
        } catch (error) {
            console.log(error)
   
        } finally {
            setTimeout(() => {
                setLoadingButtonEditTeacher(false)
                toast.success('Cập nhật giảng viên thành công');

            }, 1200);
        }
    }

    const getTeachersData = async (sort) => {
        try {
            const response = await getAllTeachers(sort);

            
            if(response) {
                
                const sortedTeachers = response.sort((a, b) => {
                    const numA = parseInt(a.giangvienid.replace('GV', '')); 
                    const numB = parseInt(b.giangvienid.replace('GV', '')); 
                    if(sort === 'asc'){
                        return numA - numB; // Sắp xếp tăng dần
                    }
                    return numB - numA; // Sắp xếp giảm dần
                });
                setTeachers(sortedTeachers)
                
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
        getProjectsData();
    },[])

    // Các controller của CouncilAssignment


    const getProjectsData = async (sort) => {
        try {
            const response = await getProjectsByStatus();
            setLoadingButtonCA(true)
            if(response) {

                if(!response.success){
                    setProjects([])
                    return 
                }
                const sortedProjects = response.data.sort((a, b) => {
                    const numA = parseInt(a.detaiid.replace('DT', '')); 
                    const numB = parseInt(b.detaiid.replace('DT', '')); 
                    if(sort === 'asc'){
                        return numA - numB; // Sắp xếp tăng dần
                    }
                    return numB - numA; // Sắp xếp giảm dần
                });
                setProjects(sortedProjects)
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

    const value = {
        councils, teachers, departmentsContext,
        loadingCC, getCouncilsData, loadingButtonCC,

        projects, getProjectsData, students,
        loadingCA, loadingButtonCA,
        getTeachersData,
        loadingButtonAddTeacher,
        loadingButtonEditTeacher,
        addTeacherContext, updateTeacherContext
    }

    return(
        <ManagementContext.Provider value={value}>
            {prop.children}
        </ManagementContext.Provider>
    )
}

export default ManagementContextProvider