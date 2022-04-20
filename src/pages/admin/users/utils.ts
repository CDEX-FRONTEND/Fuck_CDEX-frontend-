const NO_TRADES = 'Сделок не было';

export const formatTradesValues = (completedTrades: number, totalTrades: number) => {
  if (completedTrades > totalTrades) {
    throw 'Успешных сделок не может быть больше, чем общее количество сделок';
  }

  if (totalTrades === 0) {
    return NO_TRADES;
  }

  return `${(completedTrades / totalTrades * 100).toFixed()}% (${completedTrades} / ${totalTrades})`;
}

export const formatAveragePaymentTime = (averagePaymentTime: number) => {
  if (averagePaymentTime < 0) {
    throw 'Среднее время перевода не может быть отрицательным';
  }

  if (averagePaymentTime === 0) {
    return NO_TRADES;
  }

  return `${averagePaymentTime} минут(ы)`;
}
