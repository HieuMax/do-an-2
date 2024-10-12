import axios from 'axios';
import { API_ENDPOINT } from "..";

const url = "/students";

const getAllStudents = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/`);
        return response.data.sinhvien;
    } catch (error) {
        console.error('Error fetching all students:', error);
        throw error;
    }
}

export {
    getAllStudents
};
