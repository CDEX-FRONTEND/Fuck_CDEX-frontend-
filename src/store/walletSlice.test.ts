import reducer, { todoNull } from './walletSlice';

it('test wallet slice', () => {
  expect(reducer(undefined, todoNull())).toEqual({
    wallets: [],
    adress: [],
    loading: false,
    actualAddress: [],
    walletHistory: [],
    summary: 0,
    summaryUpdated: '0',
    transactionList: [],
    myTransactions: [],
    lastError: null,
    cryptoFee: null,
    outFee: '0.0000',
    transaction: null,
  });
});
