import axios from 'axios';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Navigate, useNavigate } from 'react-router-dom';
import './nprogessbar.css'
import { showErrorToast } from '../SnackBar';
// Tạo Axios instance với baseURL
const apiClient = axios.create({
  baseURL: 'https://localhost:7113/api/',
});
// Gắn token vào header của mọi request
apiClient.interceptors.request.use(
    config => {
      // Lấy token từ local storage hoặc bất kỳ nơi nào khác bạn lưu token
      const token = localStorage.getItem('token');
      // Nếu token tồn tại, thêm vào header Authorization
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      nProgress.start();
      return config;
    },
    error => {
      nProgress.done();
      return Promise.reject(error);
    }
  );

// Xử lý lỗi 401 từ phía server
apiClient.interceptors.response.use(
  response => {
    // Trả về response nếu không gặp lỗi
    nProgress.done();
    return response;
  },
  async error => {
  
    const config = error.config;
    // console.log(error);
    if (error.response.status === 401) {
      // Gọi API Refresh Token
      try {
        const AccessToken = localStorage.getItem('token');
        const RefreshToken = localStorage.getItem('refreshToken');
        const response = await post('User/RefreshToken', { AccessToken,  RefreshToken});
        // Lưu lại token mới và gửi lại request với token mới
        localStorage.removeItem('token');
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        config.headers['Authorization'] = "Bearer " + response.accessToken;
        return apiClient(config);
      } catch (error) {
        console.log(error + "testeroror");

        // Việc refresh thất bại, bạn có thể logout user ở đây hoặc thực hiện hành động khác

        nProgress.done();
        if (error.response.status === 500) {
            console.log(error + "erro123");
           return window.location.href = '/logOut';
   }
        return Promise.reject(error);
      }
    }else{
      showErrorToast("Nhập đầy đủ thông tin");
    }

    // Đối với các lỗi khác, chúng ta chỉ đơn giản trả về Promise reject
    return Promise.reject(error);
  }
);

// Hàm này sẽ được gọi mỗi khi có GET request
export const get = async (path, options = {}) => {
  const response = await apiClient.get(path, options);
  return response.data;
};

// Tương tự cho POST, DELETE và PUT (hoặc UPDATE)
export const post = async (path, data, options = {}) => {
  const response = await apiClient.post(path, data, options);
  return response.data;
};

export const del = async (path, options = {}) => {
  const response = await apiClient.delete(path, options);
  return response.data;
};

export const update = async (path, data, options = {}) => {
  const response = await apiClient.put(path, data, options);
  return response.data;
};


export default apiClient;

