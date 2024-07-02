import { API_CLIENT } from '../constants';
import { Mailing } from '../types';

export const getMailings = async (
  page: number,
  limit: number,
  search?: string
) => {
  try {
    const response = await API_CLIENT.get(
      `/mailings?page=${page}&limit=${limit}&search=${search || ''}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching mailings:', error);
    throw error;
  }
};

export const addMailingApi = async (mailing: Mailing) => {
  try {
    const response = await API_CLIENT.post('/mailings', mailing);
    return response.data;
  } catch (error) {
    console.error('Error adding mailing:', error);
    throw error;
  }
};

export const updateMailingApi = async (mailing: Partial<Mailing>) => {
  try {
    const response = await API_CLIENT.put(`/mailings/${mailing.id}`, mailing);
    return response;
  } catch (error) {
    console.error('Error updating mailing:', error);
    throw error;
  }
};

export const deleteMailingApi = async (id: number) => {
  try {
    const response = await API_CLIENT.delete(`/mailings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting mailing:', error);
    throw error;
  }
};
