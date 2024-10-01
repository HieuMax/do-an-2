import { API_ENDPOINT } from "..";

const url = "/departments";


// export const getNameDepartmentById = async (id) => {
//     const response = await fetch(`${API_ENDPOINT}${url}/${id}`)
//     const departments = await response.json();
//     const name = departments.giangvien.hoten
//     // console.log(name)
//     return name;
// }

export const getAllDepartments = async () => {
    const response = await fetch(`${API_ENDPOINT}${url}`)
    const departments = await response.json();
    // console.log(name)
    return departments.khoa;
}

export const getDepartmentsById = async (id) => {
    const response = await fetch(`${API_ENDPOINT}${url}/${id}`)
    const departments = await response.json();
    // console.log(departments
    return departments;
}
