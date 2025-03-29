import axios from 'axios';
import { getCookie } from 'cookies-next';

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosApi.interceptors.request.use((config) => {
  const token = getCookie('jwt');
  console.log(token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosApi;
