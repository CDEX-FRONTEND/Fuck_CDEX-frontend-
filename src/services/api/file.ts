import { httpClient } from '../httpClient';

export const uploadFileService = {
  uploadFile(data: any) {
    return httpClient.post(`/api/v1/file/upload`, data, {headers: {
            'content-type': 'multipart/form-data'
        }});
  },
  getFileInfo(id: string) {
    return httpClient.get(`/api/v1/file/${id}/info`);
  }
};