import { AxiosResponse } from "axios";
import { httpClient } from "../httpClient";

export interface feeCalculateProps {
    cryptoCurrencyId: string;
    walletId: string;
  }

export const feeService = {
    getCalculatedFee(props: feeCalculateProps): Promise<AxiosResponse> {
        return httpClient.post("/api/v1/fee/crypto/calculate", props);
      },
};