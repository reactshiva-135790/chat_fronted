import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const createUser = (userData) => API.post('/users/create', userData);
export const getAllUsers = () => API.get('/users');
export const sendMessage = (id, payload) => API.post(`/messages/send/${id}`, payload);
export const getMessages = (id) => API.get(`/messages/${id}`);
