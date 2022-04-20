import { httpClient } from '../httpClient';

export const notificationsService = {
  getSettings() {
    return httpClient.get('/api/v1/notifications/settings/my');
  },
  enableSetting(eventType: string, eventKey: string) {
    return httpClient.get(
      `api/v1/notifications/settings/${eventType}/${eventKey}/enable`
    );
  },
  disableSetting(eventType: string, eventKey: string) {
    return httpClient.get(
      `api/v1/notifications/settings/${eventType}/${eventKey}/disable`
    );
  },
};
