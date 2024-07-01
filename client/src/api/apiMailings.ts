import { apiClient } from '../constants';
import { Mailing } from '../types';

export const getMailings = async (page: number, limit: number) => {
  try {
    const response = await apiClient.get(
      `/mailings?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching mailings:', error);
  }
};

export const addMailingApi = async (mailing: Mailing) => {
  try {
    const response = await apiClient.post('/mailings', mailing);
    return response.data;
  } catch (error) {
    console.error('Error adding mailing:', error);
  }
};

export const updateMailingApi = async (mailing: Partial<Mailing>) => {
  try {
    const response = await apiClient.put(`/mailings/${mailing.id}`, mailing);
    return response;
  } catch (error) {
    console.error('Error updating mailing:', error);
  }
};

export const deleteMailingApi = async (id: number) => {
  try {
    const response = await apiClient.delete(`/mailings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting mailing:', error);
  }
};
