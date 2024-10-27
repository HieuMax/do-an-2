import axios from 'axios';
import { API_ENDPOINT } from "..";

const url = "/councils";

const getAllCouncils = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/getAllCouncils`);
        return response.data.hoidong;
    } catch (error) {
        console.error('Error fetching all councils:', error);
        throw error;
    }
}

const getAllTeachers = async (sort) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/getAllTeachers`);
        const teachers = response.data.giangvien;

       
        return teachers;
    } catch (error) {
        console.error('Error fetching all teachers:', error);
        throw error;
    }
}


const getAllDepartments = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/getAllDepartments`);
        return response.data.khoa;
    } catch (error) {
        console.error('Error fetching all departments:', error);
        throw error;
    }
}

const addCouncilWithMembers = async (councilData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}${url}/addCouncilWithMembers`, councilData);
        return response.data.hoidongid;
    } catch (error) {
        console.error('Error adding council with members:', error);
        throw error;
    }
}

const getCouncilMembers = async (hoidongid) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/getCouncilMembers/${hoidongid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching council members:', error);
        return null;
    }
}

const updateCouncilMember = async (payload) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}${url}/updateCouncilMember`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating council member:', error);
        return { success: false, message: 'Error updating council member' };
    }
}

const deleteCouncil = async (hoidongid) => {
    try {
        const response = await axios.delete(`${API_ENDPOINT}${url}/deleteCouncil/${hoidongid}`);
        if(response.data.success){
            return response;
        } else {
            return response;
        }
    } catch (error) {
        console.error('Error deleting council:', error);
        throw error;
    }
}


const getCouncilById = async (hoidongid) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/${hoidongid}`);
        return response.data.hoidong;
    } catch (error) {
        console.error('Error fetching council members:', error);
        return null;
    }
}

export {
    getAllCouncils,
    getAllTeachers,
    getAllDepartments,
    addCouncilWithMembers,
    getCouncilMembers,
    updateCouncilMember,
    deleteCouncil,
    getCouncilById
};
