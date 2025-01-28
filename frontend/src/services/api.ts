import axios from 'axios';
import { Holiday, FileUploadResponse } from '../types/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export const validateExcel = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/check/excel/holidays', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error validating excel:', error);
    throw error;
  }
};

export const validateHolidayExcel = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/check/excel/holidays', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error validating holiday excel:', error);
    throw error;
  }
};

export const uploadHolidays = async (file: File): Promise<Holiday[]> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/upload/excel/holidays', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading holidays:', error);
    throw error;
  }
};

export const fetchHolidays = async (): Promise<Holiday[]> => {
  try {
    const response = await api.get('/api/holidays');
    return response.data;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error;
  }
};

export default api;