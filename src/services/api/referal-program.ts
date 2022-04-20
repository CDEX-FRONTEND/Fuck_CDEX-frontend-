

import { AxiosResponse } from 'axios';
import { ParamsForListType } from '../../store/referralProgramSlice';
import { httpClient } from '../httpClient';

export const referralProgramService = {

  baseUrl: '/api/v1/referral-program/',

  getReferalProgramLink(type: string): Promise<AxiosResponse> {
    return httpClient.get(this.baseUrl + `link/${type}`);
  },
  getReferalProgramRewardListMy(params: ParamsForListType): Promise<AxiosResponse> {
    return httpClient.get(this.baseUrl + 'reward/list/my', { params });
  },
  getReferalProgramInvitedListMy(params: ParamsForListType): Promise<AxiosResponse> {
    return httpClient.get(this.baseUrl + 'invited/list/my', { params });
  },

};