import { API_ENDPOINT } from "..";
import { getMentorById, getNameMentorById } from "../2.mentors/mentors";

const url = "/projects";

export const getAllProjects = async () => {
    const response = await fetch(`${API_ENDPOINT}${url}`);
    const projects = await response.json();
    const arr = projects.detai
    arr.forEach(async(element) => {
        const name = await getNameMentorById(element.giangvienchunhiemid);
        element.hotengiangvien = name
    });
    return projects;
}

export const getProjectById = async(id) => {
    const response = await fetch(`${API_ENDPOINT}${url}/${id}`)
    const project = await response.json();
    // const fillInforMentor = async () => {
    const mentor = await getMentorById(project.detai.giangvienchunhiemid)
    // console.log(project.detai)
    const filledProject = {
        ...project.detai,
        hotenGV: mentor.hoten,
        emailGV: mentor.mail,
        sdtGV: mentor.sdt,
        ...project.members
    }
    return filledProject;
    // }
}

export const updateStatusProject = async (status, id) => {
    const data = {
        status: status,
        id: id
    }
    const response = await fetch(`${API_ENDPOINT}${url}/updateStatus`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json',
            'apiKey': "notest"
        },
        body: JSON.stringify(data)
    })
    // console.log(response)
    // if(response.ok) {
    //     console.log("ok")
    // }
}

export const uploadFile = async (formData) => {
    console.log(formData)
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/uploadFile`, {
            method: 'POST',
            body: formData,
        })
        return response
    } catch (error) {
        return { error: error }
    }
}
// module.exports = 