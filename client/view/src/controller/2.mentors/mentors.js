import { API_ENDPOINT } from "..";
import axios from "axios";
const url = "/mentors";

// export const getAllProjects = async () => {
//     const response = await fetch(`${API_ENDPOINT}${url}`);
//     const projects = response.json();
//     return projects;
// }

export const getNameMentorById = async (id) => {
    const response = await fetch(`${API_ENDPOINT}${url}/${id}`)
    const mentor = await response.json();
    const name = mentor.giangvien.hoten
    // console.log(name)
    return name;
}
export const getMentorById = async (id) => {
    const response = await fetch(`${API_ENDPOINT}${url}/${id}`)
    const mentor = await response.json();
    const name = mentor.giangvien
    // console.log(name)
    return name;
}

export const addNewTeacher = async (teacherData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}${url}/addNewTeacher`, teacherData);

        return response.giangvienid;
        console.log(teacherData)
    } catch (error) {
        console.error('Error adding new Teacher:', error.response ? error.response.data : error.message);
        throw error;
    }
};
