import { apiClient } from '../constants';

export const getGiftCardsApi = async () => {
  try {
    const response = await apiClient.get('/gift-cards');
    return response.data;
  } catch (error) {
    console.error('Error fetching gift cards:', error);
  }
};

export const getGiftCardsByIdsApi = async (ids: number[]) => {
  try {
    const response = await apiClient.get('/gift-cards/ids', {
      params: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching gift cards by IDs:', error);
    throw error;
  }
};

export const updateGiftCardsApi = async (
  updates: { id: number; remainingQuantity: number }[]
) => {
  try {
    const response = await apiClient.put('/gift-cards', updates);
    return response.data;
  } catch (error) {
    console.error('Error updating gift cards:', error);
  }
};
