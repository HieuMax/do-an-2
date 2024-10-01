import { API_ENDPOINT } from "..";

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
    // console.log(name)
    return mentor.giangvien;
}
