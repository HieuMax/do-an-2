import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ENDPOINT } from "../controller/index";

export const handleLogoutApi = async () => {

    localStorage.removeItem('userInfo')
    // Trường hợp số 02: Dùng http Only Cookies > Gọi API để xử lý remove Cookies
    return await authorizedAxiosInstance.delete(`${API_ENDPOINT}/auth/logout`)
}

export const refreshTokenAPI = async () => {
    return await authorizedAxiosInstance.put(`${API_ENDPOINT}/auth/refresh_token`)
}