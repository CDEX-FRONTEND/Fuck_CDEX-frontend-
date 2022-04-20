import { AxiosResponse } from 'axios';
import {
  BalanceUpdateProps,
  CryptoOutProps,
  HistoryType,
  WalletType,
  DepositWithCode,
  CreationCodeType,
  FullCodeProps
} from '../../store/walletSlice';
import { httpClient } from '../httpClient';

export interface GetWalletsResponseValue {
  wallets: WalletType[];
}

export interface GetActualAddressResponseValue {
  address: string;
}

export interface GetHistoryResponseValue {
  walletHistory: HistoryType[];
}

export interface TransactionListProps {
  direction: string;
  status: string;
  page: number;
  take: number;
}

export interface GetMyTransactionsProps {
  direction?: string;
  page: number;
  take: number;
}

export interface CryptoFeeProps {
  currencyId: string;
  networkId: string;
  volume: number
}

export const walletService = {
  getWallets(): Promise<AxiosResponse<GetWalletsResponseValue>> {
    return httpClient.get('/api/v1/wallets');
  },

  getActualAddress(
    walletId: string
  ): Promise<AxiosResponse<GetActualAddressResponseValue>> {
    return httpClient.get('/api/v1/wallet/actual-address', {
      params: { walletId },
    });
  },

  getCurrencyList(): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/currency/list');
  },

  getHistory(
    walletId: string
  ): Promise<AxiosResponse<GetHistoryResponseValue>> {
    return httpClient.get('/api/v1/wallet/history', { params: { walletId } });
  },

  getMyTransactions(props: GetMyTransactionsProps): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/wallet/transactions/list/my', {
      params: props,
    });
  },

  getTransaction(id: string): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/wallet/transactions/' + id);
  },

  getFullCode(code: string): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/code/full', {id: code});
  },

  getListMyCode(): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/code/my');
  },

  postBalanceUp(props: BalanceUpdateProps): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/wallets/up', props);
  },

  postCreateCode(props: CreationCodeType): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/code/create', props);
  },

  postBalanceDown(props: BalanceUpdateProps): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/wallets/down', props);
  },

  redeemGiftCode(props: DepositWithCode): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/code/redeem', props);
  },
  createCryptoOut(props: CryptoOutProps): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/wallet/create-crypto-out', props);
  },
  getSummary(currency: string): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/wallets/summary', { params: { currency } });
  },
  getTransactionList(props: TransactionListProps): Promise<AxiosResponse> {
    return httpClient.get('/api/v1/wallet/transactions/list', props);
  },
  confirmTransaction(transactionId: string): Promise<AxiosResponse> {
    return httpClient.post(
      '/api/v1/wallet/transactions/confirm/' + transactionId,
      {}
    );
  },
  rejectTransaction(transactionId: string): Promise<AxiosResponse> {
    return httpClient.post(
      '/api/v1/wallet/transactions/reject/' + transactionId,
      {}
    );
  },

  getCryptoFee(props: CryptoFeeProps): Promise<AxiosResponse> {
    return httpClient.post('/api/v1/wallet/crypto-out/fee', props);
  },
  getOutFee(currencyId: string) {
    return httpClient.get(
      '/api/v1/wallet/setting/wallet.out.fee.' + currencyId
    );
  },
};
