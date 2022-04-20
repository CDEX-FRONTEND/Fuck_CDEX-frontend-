export const getEventTypeTitle = (eventType: string): any => {
  const [exchangeOrder, exchangeTrade, otcTrade, walletIn, walletOut] = [
    'exchange-order',
    'exchange-trade',
    'otc-trade',
    'wallet-in',
    'wallet-out',
  ];

  return {
    [exchangeOrder]: 'Заявки',
    [exchangeTrade]: 'Сделки (обмен)',
    [otcTrade]: 'Сделки (отс)',
    [walletIn]: 'Депозиты',
    [walletOut]: 'Выводы',
  }[eventType];
};

export const eventKeys = {
  telegram: 'telegram',
  email: 'email',
};
