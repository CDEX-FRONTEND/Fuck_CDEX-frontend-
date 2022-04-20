import { AxiosResponse } from 'axios';
import { httpClient } from '../httpClient';

export const sourceService = {
  getExternalSources(): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/external-sources/list');
  },
};
