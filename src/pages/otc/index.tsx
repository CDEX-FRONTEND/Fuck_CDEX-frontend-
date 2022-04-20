import React, { useCallback, useEffect, useState } from 'react';
import RoundedLayout from '../../components/RoundedLayout';
import View from '../../components/View';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  Container,
  Box,
  styled,
  Tabs,
  Tab,
  tabClasses,
  useTheme,
} from '@mui/material';
import {
  TabsUnstyled,
  TabsListUnstyled,
  TabUnstyled,
} from '@mui/base';
import MyTrades from '../my-trades';
import MyAdvertisements from './MyAdvertisements';
import Favorites from '../favorites';
import Messages from '../messages';
import { Redirect, useHistory } from 'react-router';
import BackButton from '../../components/BackButton';
import Toolbar from '../../components/Toolbar';
import BriefCaseIconFilled from '../../icons/BriefCaseIconGoldFilled.svg';
import ListIconFilled from '../../icons/ListIconGoldFilled.svg';
import FavoritesIconFilled from '../../icons/FavoritesIconGoldFilled.svg';
import MessageIconFilled from '../../icons/MessageIconGoldFilled.svg';
import {
  getUnreadMessagesCount,
  selectUnreadMessagesCount,
} from '../../store/chatSlice';
import { useAuth } from '../../hooks/useAuth';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Advertisements } from './Advertisements';
import useAppSelector from '../../hooks/useAppSelector';
import { AppDispatch } from '../../store';

// TODO: убрать в пользу AdvertisementSideEnum
type SideType = 'ask' | 'bid';

/**
 * P2P
 * @author Sasha Broslavskiy
 */
const Otc = () => {
  const { authenticated } = useAuth();
  const location = useLocation();
  const history = useHistory();
  const dispatch: AppDispatch = useAppDispatch();
  const unreadMessagesCount = useAppSelector(selectUnreadMessagesCount);

  // TODO: переписать в пользу AdvertisementSideEnum
  const [side, setSide] = useState<SideType>('ask');
  
  const [tab, setTab] = useState<number>(0);
  const [rightTab, setRightTab] = useState<number>(-1);
  const [tick, setTick] = useState<number>(0);
  const theme = useTheme();
  const timerTask = () => {
    dispatch(getUnreadMessagesCount());
  };

  useEffect(() => {
    dispatch(getUnreadMessagesCount());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      timerTask();
      setTick(tick === 0 ? 1 : 0);
    }, 5000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    console.log(`tab changed = ${tab}`);
    switch (tab) {
      case 0:
        setSide('ask');
        break;
      case 1:
        setSide('bid');
        break;
    }
  }, [tab]);

  const onChangeTab = useCallback((event, tab) => setTab(tab), []);

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <Box
            display="flex"
            justifyContent="space-between"
            rowGap="24px"
            minHeight="72px"
            sx={{
              flexDirection: {
                sm: 'column',
                lg: 'row',
              },
              alignItems: {
                sm: 'stretch',
                lg: 'center',
              },
              p: {
                sm: '16px 0 14px 16px',
                md: '16px 0 14px 24px',
                lg: '0 24px',
              },
            }}
          >
            <Box>
              {location.pathname === '/otc' ? (
                <Tabs value={tab} onChange={onChangeTab}>
                  <StyledTab label="Купить" />
                  <StyledTab label="Продать" />
                </Tabs>
              ) : (
                <BackButton
                  onClick={() => {
                    history.push('/otc');
                    setRightTab(-1);
                  }}
                />
              )}
            </Box>
            <TabsUnstyled defaultValue={-1}>
              <StyledTabsList
                sx={{
                  paddingBottom: {
                    sm: '10px',
                    lg: '0',
                  },
                  columnGap: {
                    sm: '24px',
                    md: '32px',
                  }
                }}
              >
                <StyledTab2
                  value={0}
                  style={{
                    ...(location.pathname.match(/^\/otc\/my-trades$/i) !== null ? ({
                      filter: 'invert(90%) sepia(50%) saturate(270%) hue-rotate(354deg) brightness(155%) contrast(100%)',
                      fontWeight: 'bold',
                    }) : {})
                  }}
                  onClick={() => history.push('/otc/my-trades')}
                >
                  <img src={BriefCaseIconFilled} alt="" />
                  Мои сделки
                </StyledTab2>
                <StyledTab2
                  value={1}
                  style={{
                    ...(location.pathname.match(/^\/otc\/my-advertisements$/i) !== null ? ({
                      filter: 'invert(90%) sepia(50%) saturate(270%) hue-rotate(354deg) brightness(155%) contrast(100%)',
                      fontWeight: 'bold',
                    }) : {})
                  }}
                  onClick={() => history.push('/otc/my-advertisements')}
                >
                  <img src={ListIconFilled} alt="" />
                  Мои объявления
                </StyledTab2>
                <StyledTab2
                  value={2}
                  style={{
                    ...(location.pathname.match(/^\/otc\/favorites$/i) !== null ? ({
                      filter: 'invert(90%) sepia(50%) saturate(270%) hue-rotate(354deg) brightness(155%) contrast(100%)',
                      fontWeight: 'bold',
                    }) : {})
                  }}
                  onClick={() => history.push('/otc/favorites')}
                >
                  <img src={FavoritesIconFilled} alt="" />
                  Избранное
                </StyledTab2>
                <StyledTab2
                  style={{
                    ...(location.pathname.match(/^\/otc\/chat$/i) !== null ? ({
                      filter: 'invert(90%) sepia(50%) saturate(270%) hue-rotate(354deg) brightness(155%) contrast(100%)',
                      fontWeight: 'bold',
                    }) : {})
                  }}
                  onClick={() => history.push('/otc/chat')}
                >
                  <img src={MessageIconFilled} alt="" />
                  Сообщения {unreadMessagesCount && unreadMessagesCount > 0 ? ` (${unreadMessagesCount})` : ''}
                </StyledTab2>
              </StyledTabsList>
            </TabsUnstyled>
          </Box>
          <Divider />
          <Box
            sx={{
              p: {
                sm: '24px 16px 16px 16px',
                md: '24px',
              }
            }}
          >
            <Switch>
              <Route exact path="/otc">
                <Advertisements side={side} />
              </Route>
              <Route exact path="/otc/my-trades" component={MyTrades} />
              <Route
                exact
                path="/otc/my-advertisements"
                component={MyAdvertisements}
              />
              <Route exact path="/otc/favorites" component={Favorites} />
              <Route exact path="/otc/chat" component={Messages} />
            </Switch>
          </Box>
        </RoundedLayout>
      </Container>
    </View>
  );
};

const StyledTab = styled(Tab)`
  font-weight: bold;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  text-transform: none;
  color: #a5a5a5;
`;

const StyledTabsList = styled(TabsListUnstyled)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  overflow-y: auto;
  flex-wrap: nowrap;
`;

const StyledTab2 = styled(TabUnstyled)`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #9E9E9E;
  gap: 10px;
  white-space: nowrap;
`;

const Divider = styled(Box)`
  border-bottom: 1px solid #d9d9d9;
`;

export default Otc;
