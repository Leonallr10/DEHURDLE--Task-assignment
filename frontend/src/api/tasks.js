import API from './axios';

export const getTasks = (status) =>
  API.get('/tasks', { params: status ? { status } : {} });

export const createTask = (data) => API.post('/tasks', data);

export const updateTask = (id, data) => API.patch(`/tasks/${id}`, data);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);