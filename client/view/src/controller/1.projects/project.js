import { API_ENDPOINT } from "..";
import { getNameMentorById } from "../2.mentors/mentors";

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

// module.exports = 