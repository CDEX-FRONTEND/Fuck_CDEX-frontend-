import Axios from 'axios';

const config = {
  baseURL: process.env.REACT_APP_HTTP_API_URL,
  //withCredentials: true
};

export const axios = Axios.create(config);

export const httpClient = {
  setToken(token: string | null) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  get(url: string, data?: any) {
    return axios.get(url, data);
  },

  post(url: string, data?: any, headers?: any) {
    return axios.post(url, data, headers);
  },

  put(url: string, data: any) {
    return axios.put(url, data);
  },

  patch(url: string, data: any) {
    return axios.patch(url, data);
  },

  delete(url: string, data: any) {
    return axios.delete(url, data);
  },
};
