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
  } catch (error) {
      console.error('Error adding new Teacher:', error.response ? error.response.data : error.message);
      throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}${url}/updateTeacher/${id}`, teacherData);
        return response.data;
    } catch (error) {
        console.error('Error updating Teacher:', error.response ? error.response.data : error.message);
        throw error;
    }
};
export const uploadTeacherList = async (excelData) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}${url}/uploadTeacherList`, { data: excelData });
      
      if (response.data.success) {
        // console.log('Thêm danh sách giảng viên thành công');
        return response.data;
      } else {
        // console.error('Lỗi:', response.data.error);
        return ({ success: false, message: 'Thêm danh sách giảng viên thất bại!' });
      }
    } catch (error) {
        return ({ success: false, message: 'Thêm danh sách giảng viên thất bại!' });

    }
  };
 export const deleteTeacher = async (giangvienid) => {
    try {
      
      const response = await axios.delete(`${API_ENDPOINT}${url}/deleteTeacher/${giangvienid}`);
      if(response.data.success){
        return response;
      } else {
        return response;
      }
      
    } catch (error) {
      return error('Lỗi khi gửi yêu cầu:', error);
      // return response.error
    }
  };