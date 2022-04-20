import { AxiosResponse } from 'axios';
import { httpClient } from '../httpClient';
import {
    ComplaintReason,
    Complaint,
    ComplaintsListType,
    ComplaintsParams
} from '../../store/complaintSlice'

export interface GetReasonValue {
    reasons: ComplaintReason[];
}


export const complaintService = {

    getReason():Promise<AxiosResponse<GetReasonValue>>{
        return httpClient.get('/api/v1/complaint/reasons');
    },
    addComplaint(params: Complaint): Promise<AxiosResponse>{
        return httpClient.post('/api/v1/complaint', params);
    },
    getComplaintsList(params: ComplaintsParams):Promise<AxiosResponse<ComplaintsListType>>{
        return httpClient.get('/api/v1/complaint/list', {params});
    },
    getComplaint(id: string):Promise<AxiosResponse>{
        return httpClient.get('/api/v1/complaint/' + id);
    }
}
