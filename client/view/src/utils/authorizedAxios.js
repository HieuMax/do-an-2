
import axios from "axios";
import { toast } from 'react-toastify'
import { handleLogoutApi, refreshTokenAPI } from "../api/index";
import { getNavigate } from "../api/navigation";

// Khởi tạo 1 đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian giờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredintials: Sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE (phục vụ trường hợp nếu chúng ta sử dụng JWT Tokens (refresh & access )   
// theo cơ chế httpOnly Cookie)

authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn giữa mọi Request & Response)
 * https://axios-http.com/docs/interceptors
 */

// Khởi tạo 1 cái promie cho việc gọi api refreshToken
// Mục đích tạo Promise này để khi nhận yêu cầu refreshToken đầu tiên thì hold lại việc API Refresh_token
// Cho tới khi xong xuôi thì mới retry lại những api bị lỗi trước đó thay vì cứ gọi lại API refresh token liên tục
let refreshTokenPromise = null

// Add a response interceptor: Can thiệt vào giữa những cái response nhận về từ API
authorizedAxiosInstance.interceptors.response.use((response) => {
    /* Mọi mã http status code nằm trong khoảng 200 - 299 sẽ là success và rơi vào đây */
    return response
  }, (error) => {
    /* Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây */
    // console.log(error) là thấy cấu trúc lỗi

    /** Khu vực quan trọng: Xử lý refreshToken tự động */
    // Nếu như nhận mà 401 từ BE, thì gọi API logout luôn
    if (error.response?.status === 401){
    
      handleLogoutApi().then(() => {
        const navigate = getNavigate(); // Lấy navigate
        if (navigate) {
          navigate('/login'); // Điều hướng thay cho location.href
        } else {
          window.location.href = '/login'; // fallback trong trường hợp navigate chưa được set
        }
      });
    }
    // Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequest = error.config
    // console.log('originalRequest: ', originalRequest)
    if (error.response?.status === 410 && originalRequest){
      if(!refreshTokenPromise ){
        // Lấy refreshToken từ localStorage cho (Trường hợp 1)
        // const refreshToken = localStorage.getItem('refreshToken')
        // Gọi api refreshToken


        refreshTokenPromise = refreshTokenAPI()
          .then((res) => {
          })
          .catch(_error => {
            // Nếu nhận bất cứ lỗi nào từ api refresh token thì cứ logout luôn
            handleLogoutApi().then(() => {
              const navigate = getNavigate(); // Lấy navigate
              if (navigate) {
                navigate('/login'); // Điều hướng thay cho location.href
              } else {
                window.location.href = '/login'; // fallback trong trường hợp navigate chưa được set
              }
            });
  
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      // Cuối cùng mới return cái refreshTokenPromise trong trường hợp success ở đây
      return refreshTokenPromise.then(() => {
        // Bước cuối cùng quan trọng: return lại axios instance kết hợp với originalRequest để gọi lại những api ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequest)
      })

    }


    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code 1 lần: clean code)
    // Ngoại trừ mã 410 - GONE phục vụ
    if (error.response?.status !== 410 && error.response?.status !== 500){
      // toast.error(error.response?.data?.message || error?.message)
      toast.error(error.response?.data?.message || error?.message)

    }
    if (error.response?.status == 500){
      // toast.error(error.response?.data?.message || error?.message)
      // toast.error(error.response?.data?.message || error?.message)

    }
    return Promise.reject(error)
  });

export default authorizedAxiosInstance