import axios from 'axios';

export const API_CLIENT = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const LIMIT_ROWS = 10;
