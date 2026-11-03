import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mengambil daftar tugas berdasarkan ID Kelas (sesuaikan route backend)
export const getTugasByClass = async (classId) => {
  try {
    const response = await API.get(`/tugas/class/${classId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Membuat tugas baru
export const createTugas = async (tugasData) => {
  try {
    const response = await API.post('/tugas', tugasData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};