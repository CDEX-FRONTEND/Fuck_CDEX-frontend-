import { httpClient } from '../httpClient';

export type GetMessagesRequestValuesType = {
  id: string;
  page: number;
  take: number;
};

export const chatService = {
  baseUrl: '/api/v1/chat/',
  getMessages(requestValues: GetMessagesRequestValuesType) {
    return httpClient.get(`${this.baseUrl}${requestValues.id}/message/list`, {params: {page: requestValues.page, take: requestValues.take}});
  },
  getUnreadMessagesCount () {
    return httpClient.get(`${this.baseUrl}messages/unreaded-count/all`)
  },
  setMessageRead (id:string) {
    return httpClient.get(`${this.baseUrl}message/${id}/set-readed`)
  }
};
