import axios from 'axios';
import { API_ENDPOINT } from "..";

const url = "/article";

const uploadImageToCloudinary = async (formData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}${url}/uploadSingleImage`, formData);
        return response.data;
    } catch (error) {
        console.error('Error fetching all councils:', error);
        throw error;
    }
}

const addNewArticle = async (requestData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}${url}/addNewArticle`, requestData);
        return response.data
    } catch (error) {
        console.error('Error adding council with members:', error);
        throw error;
    }
}

const getAllArticle = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/getAllArticle`);
        return response.data.baiviet
    } catch (error) {
        console.error('Error get data:', error);
        throw error;
    }
}

const getArticleBySlug = async (slug) => {
    try {


        const response = await axios.get(`${API_ENDPOINT}${url}/getArticleBySlug/${slug}`);
        return response.data

    } catch (error) {
        if(error.response.data){
            return error.response.data
        }
    }
}

const getArticleById = async (id) => {
    try {


        const response = await axios.get(`${API_ENDPOINT}${url}/getArticleById/${id}`);
        return response.data

    } catch (error) {
        if(error.response.data){
            return error.response.data
        }
    }
}
const deleteArticle = async (articleId) => {
    try {
      
      const response = await axios.delete(`${API_ENDPOINT}${url}/deleteArticle/${articleId}`);
      if(response.data.success){
        return response.data;
      } else {
        return response.data;
      }
      
    } catch (error) {
      return error('Lỗi khi gửi yêu cầu:', error);
    }
  };

const updateArticle = async (articleId,requestData) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}${url}/updateArticle/${articleId}`, requestData);
        return response.data
    } catch (error) {
        console.error('Error Article:', error);
        throw error;
    }
}
export {
    uploadImageToCloudinary,
    addNewArticle,
    getAllArticle,
    getArticleBySlug,
    deleteArticle,
    getArticleById,
    updateArticle
};
