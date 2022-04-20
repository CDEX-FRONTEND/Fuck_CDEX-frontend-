import { AxiosResponse } from 'axios';
import { httpClient } from '../httpClient';
import {IsUserFavoriteParamsType} from '../../store/userSlice';

export const userService = {
  getMe() {
    return httpClient.get('/api/v1/auth/me');
  },
  getFavoriteUsers() {
    return httpClient.get('/api/v1/user/favorite/list');
  },
  getIsFavoriteUser(params: IsUserFavoriteParamsType) {
    return httpClient.get('/api/v1/user/favorite/is-favorite', {params})
  },
  addFavoriteUser(id: string) {
    return httpClient.get(`/api/v1/user/favorite/add/${id}`);
  },
  removeFavoriteUser(id: string): Promise<AxiosResponse> {
    return httpClient.get(`/api/v1/user/favorite/remove/${id}`);
  },
  postName(name: string) {
    return httpClient.post('/api/v1/user/name', { name });
  },
};
