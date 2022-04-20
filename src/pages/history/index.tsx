import React, { useState } from 'react';
import View from '../../components/View';
import Toolbar from '../../components/Toolbar';
import RoundedLayout from '../../components/RoundedLayout';
import Tabs from '../../components/Tabs';
import ExchangeTransactions from './exchangeTransactions';
import P2pTransactions from './p2pTransactions';
import Replenishment from './replenishment';
import { Redirect } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { Container, Box, styled } from '@mui/material';
import MobileTabs from './MobileTabs';

const History = () => {
  const { authenticated } = useAuth();

  const [tab, setTab] = useState<number>(0);

  const getTabContent = () => {
    switch (tab) {
      case 0:
        return <P2pTransactions />;
      case 1:
        return <Replenishment />;
      case 2:
        return <ExchangeTransactions />;
      default:
        return '';
    }
  };

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  const tabs = [ 'P2P сделки', 'Пополнения и выводы', 'Коды'];

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <HeaderContainer>
            <Box
              sx={{
                display: {
                  md: 'block',
                  xs: 'none',
                }
              }}
            >
              <Tabs
                items={tabs}
                onChanged={(index) => setTab(index)}
                defaultValue={tab}
              />
            </Box>
            <Box
              sx={{
                display: {
                  xs: 'block',
                  md: 'none',
                },
              }}
            >
              <MobileTabs tabs={tabs} tab={tab} setTab={setTab} />
            </Box>
          </HeaderContainer>
          <Box p="24px">
            {getTabContent()}
          </Box>
        </RoundedLayout>
      </Container>
    </View>
  );
};

const HeaderContainer = styled(Box)`
  padding: 24px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #D9D9D9;
  div {
    font-size: 16px;
    font-weight: 400;
    &[class*="active"] {
      color: ${(props) => props.theme.palette.primary.main};
    }
  }
`;

export default History;
