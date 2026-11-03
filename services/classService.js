import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// Otomatis menyisipkan token jika dosen sudah login
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fungsi untuk mengambil data kelas
export const getClasses = async () => {
  try {
    const response = await API.get('/classes'); 
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};