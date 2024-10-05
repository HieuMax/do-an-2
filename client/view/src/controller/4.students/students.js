import { API_ENDPOINT } from "..";

const url = "/students";


export const getAllStudents = async () => {
    const response = await fetch(`${API_ENDPOINT}${url}`)
    const students = await response.json();
    // console.log(name)
    return students.sinhvien;
}

export const getStudentsById = async (id) => {
    const response = await fetch(`${API_ENDPOINT}${url}/${id}`)
    const students = await response.json();

    return students;
}


