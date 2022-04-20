import { httpClient } from '../httpClient';

export type GetUsersRequestValuesType = {
  page: number;
  take: number;
  nameFilter: string;
  addActiveUsers: boolean;
  addBannedUsers: boolean;
};

export const adminService = {
  basePath: '/api/v1/admin/',
  getUsers({ page, take, nameFilter, addActiveUsers, addBannedUsers }: GetUsersRequestValuesType) {
    const payload: any = {
      page,
      take,
      filters: [],
      orders: [
        {
          field: "name",
          direction: "DESC"
        }
      ]
    };

    if (nameFilter.length > 0) {
      payload.filters.push({
        field: "name",
        operator: "search",
        value: `%${nameFilter}%`
      });
    }

    if (!addActiveUsers || !addBannedUsers) {
      payload.filters.push({
        field: "isBanned",
        operator: "=",
        value: addBannedUsers
      });
    }

    return httpClient.post(`${this.basePath}users`, payload);
  },
  getUser(id: string) {
    return httpClient.get(`${this.basePath}user/${id}`);
  },
  getStatistic(dateRange: string) {
    return httpClient.get(`${this.basePath}statistic?date-range=${dateRange}`);
  },
  banUser(userId: string) {
    return httpClient.put(`${this.basePath}user/${userId}/ban`, {});
  },
  unBanUser(userId: string) {
    return httpClient.put(`${this.basePath}user/${userId}/unban`, {});
  }
};
