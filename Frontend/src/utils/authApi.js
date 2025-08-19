import axios from 'axios';
import { toast } from 'react-toastify';

const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://rsmasj.com',
});

// 요청 시 Authorization 헤더에 JWT 토큰 추가
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    return config;
  },
  (error) => Promise.reject(error)
);

let isLogout = false;

authApi.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || '';

    const isTokenExpired =
      message.includes('만료') || message.toLowerCase().includes('expired');

    // 토큰 만료 시 1회 자동 로그아웃 처리
    if ((status === 401 || status === 403) && isTokenExpired && !isLogout) {
      isLogout = true;
      toast.info('로그인 시간이 만료되어 로그아웃됩니다.');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
    return Promise.reject(error);
  }
);

export default authApi;
