import { create } from "zustand";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ENDPOINT } from "../controller";
import { handleLogoutApi } from ".";
import axios from "axios";
import { registToServer } from "../provider/websocket";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	// user: null,
	user: JSON.parse(localStorage.getItem('userInfo')) || null,
	isAuthenticated: !!localStorage.getItem('userInfo'),  // Kiểm tra xem có thông tin người dùng trong localStorage không
	error: null,
	// error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	login: async (tendangnhap, matkhau, vaitro) => {
		set({ isLoading: true, error: null });
		try {
			const response = await authorizedAxiosInstance.post(`${API_ENDPOINT}/auth/login`, { tendangnhap, matkhau, vaitro });

			const userInfo = {
				taikhoanid: response.data.taikhoanid,
				vaitro: response.data.vaitro,
				userId: response.data.userId
			  };
			set({
				isAuthenticated: true,
				user: userInfo,
				error: null,
				isLoading: false,
			});
			localStorage.setItem('userInfo', JSON.stringify(userInfo))
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await handleLogoutApi();
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await authorizedAxiosInstance.get(`${API_ENDPOINT}/dashboard/accessa`);
			set({ user: response.data, isAuthenticated: true, isCheckingAuth: false });
			// return { isAuthenticated }
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	checkAuthHold: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_ENDPOINT}/dashboard/accessa`);
			set({ user: response.data, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	connectSocketServer: async (auth) => {
		if (!auth) return
		set({ connect: false, error: null });
		try {

			const userId = JSON.parse(window.localStorage.getItem("userInfo")).taikhoanid
			// if (!registToServer(userId)) {
			// 	set({ connect: false, error: "Connected fail" });
			// } 
			registToServer(userId)

		} catch (error) {
			set({ error: error, connect: false });
		}
	},


}));

