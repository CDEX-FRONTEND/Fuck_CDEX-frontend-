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
            items={['???? ??????????????', '???? ????????????', '???? ??????????', '???? ?????? ??????????']}
            onChanged={(index) => onSelectedTabChanged(index)}
            bordered
          />

          <div className={styles.mainContainer}>
            <div className={styles.itemContainer}>
              {firstRowItemElement('??????????', '?????????????? CSV')}
              {rowItemElement([
                {
                  label: '?????????? ????????????',
                  value: `${exchange?.total} ${exchange?.totalCurrency}`,
                },
                { label: '???????????????????? ????????????', value: exchange?.tradeCount },
                {
                  label: '???????????????? ????????????????????',
                  value: `${exchange?.feeTotal} ${exchange?.feeCurrency}`,
                },
              ])}
            </div>

            <div className={styles.itemContainer}>
              {firstRowItemElement('P2P', '?????????????? CSV')}
              {rowItemElement([
                {
                  label: '?????????? ????????????',
                  value: `${otc?.total}  ${otc?.totalCurrency}`,
                },
                { label: '???????????????????? ????????????', value: otc?.tradeCount },
                {
                  label: '???????????????? ????????????????????',
                  value: `${otc?.feeTotal} ${otc?.feeCurrency}`,
                },
              ])}
            </div>

            <div className={styles.itemContainer}>
              {firstRowItemElement('????????????', '??????????????????????')}
              {rowItemElement([
                {
                  label: '???????????? ??????????????????',
                  value: `${actives?.totalWallet} ${actives?.totalWalletCurrency}`,
                },
                {
                  label: '??????????????????',
                  value: `${actives?.totalWalletInput} ${actives?.totalWalletInputCurrency}`,
                },
                {
                  label: '????????????',
                  value: `${actives?.totalWalletOutput} ${actives?.totalWalletOutputCurrency}`,
                },
              ])}
            </div>

            <div className={styles.itemContainer}>
              {firstRowItemElement('????????????????????????', '??????????????????????')}
              {rowItemElement([
                { label: '??????????', value: users?.total },
                { label: '??????????', value: users?.totalNew },
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
