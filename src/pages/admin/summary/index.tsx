import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import NoData from '../../../components/NoData';
import Tabs from '../../../components/Tabs';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { getStatistic, selectSummary } from '../../../store/adminSlice';
import styles from './style.module.scss';

const Summary = () => {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<string>('today');

  const exchange = useAppSelector(selectSummary)?.exchange;
  const otc = useAppSelector(selectSummary)?.otc;
  const actives = useAppSelector(selectSummary)?.actives;
  const users = useAppSelector(selectSummary)?.users;

  useEffect(() => {
    dispatch(getStatistic(type));
  }, [type]);

  const firstRowItemElement = (
    firstItemLabel: string,
    firstItemExtraInfo: string
  ) => {
    return (
      <div className={styles.firstItem}>
        <div className={styles.itemImg}> </div>
        <div className={styles.itemText}>
          <div className={styles.firstItemLabel}> {firstItemLabel} </div>
          {/* <div className={styles.firstItemExtraInfo}>{firstItemExtraInfo} </div> */}
        </div>
      </div>
    );
  };

  const rowItemElement = (data: Array<{ label: string; value: any }>) => {
    return (
      <>
        {data.map((rowElement) => (
          <div className={styles.item}>
            <div className={styles.itemLabel}> {rowElement.label} </div>
            <div className={styles.itemValue}> {rowElement.value} </div>
          </div>
        ))}
      </>
    );
  };

  const onSelectedTabChanged = (index: number) => {
    switch (index) {
      case 0:
        setType('today');
        break;
      case 1:
        setType('week');
        break;
      case 2:
        setType('month');
        break;
      case 3:
        setType('all');
        break;
      default:
        break;
    }
  };

  return (
    <Box p="40px">
      {exchange ? (
        <>
          <Tabs
            items={['За сегодня', 'За неделю', 'За месяц', 'За все время']}
            onChanged={(index) => onSelectedTabChanged(index)}
            bordered
          />

          <div className={styles.mainContainer}>
            <div className={styles.itemContainer}>
              {firstRowItemElement('Биржа', 'Скачать CSV')}
              {rowItemElement([
                {
                  label: 'Общий оборот',
                  value: `${exchange?.total} ${exchange?.totalCurrency}`,
                },
                { label: 'Количество сделок', value: exchange?.tradeCount },
                {
                  label: 'Коммисии заработано',
                  value: `${exchange?.feeTotal} ${exchange?.feeCurrency}`,
                },
              ])}
            </div>

            <div className={styles.itemContainer}>
              {firstRowItemElement('P2P', 'Скачать CSV')}
              {rowItemElement([
                {
                  label: 'Общий оборот',
                  value: `${otc?.total}  ${otc?.totalCurrency}`,
                },
                { label: 'Количество сделок', value: otc?.tradeCount },
                {
                  label: 'Коммисии заработано',
                  value: `${otc?.feeTotal} ${otc?.feeCurrency}`,
                },
              ])}
            </div>

            <div className={styles.itemContainer}>
              {firstRowItemElement('Активы', 'Детализация')}
              {rowItemElement([
                {
                  label: 'Баланс кошельков',
                  value: `${actives?.totalWallet} ${actives?.totalWalletCurrency}`,
                },
                {
                  label: 'Пополнили',
                  value: `${actives?.totalWalletInput} ${actives?.totalWalletInputCurrency}`,
                },
                {
                  label: 'Вывели',
                  value: `${actives?.totalWalletOutput} ${actives?.totalWalletOutputCurrency}`,
                },
              ])}
            </div>

            <div className={styles.itemContainer}>
              {firstRowItemElement('Пользователи', 'Детализация')}
              {rowItemElement([
                { label: 'Всего', value: users?.total },
                { label: 'Новых', value: users?.totalNew },
                { label: '', value: '' },
              ])}
            </div>
          </div>
        </>
      ) : (
        <NoData />
      )}
    </Box>
  );
};
export default Summary;
