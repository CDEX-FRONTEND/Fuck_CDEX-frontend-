import React, { useState } from 'react';
import View from '../../components/View';
import Toolbar from '../../components/Toolbar';
import RoundedLayout from '../../components/RoundedLayout';
import Confidentiality from './confidentiality';
import Rules from './rules';
import LicenseAgreement from './license-agreement';
import CookiePolicy from './cookie-policy';
import UsersAgreement from './users-agreement';
import { useQuery } from '../../hooks/useQuery';
import { Box, Container } from '@mui/material';
import MobileTabs from './MobileTabs';

const Argeements = () => {
  const query = useQuery();
  const queryTab: string | null = query.get('tab');
  const [tab, setTab] = useState<number>(
    queryTab === null ? 0 : Math.max(0, Math.min(4, parseInt(queryTab)))
  );

  const tabs = [
    {
      label: 'Политика конфиденциальности',
      component: <Confidentiality />
    },
    {
      label: 'Правила и комиссия',
      component: <Rules />
    },
    {
      label: 'Лицензионное соглашение',
      component: <LicenseAgreement />
    },
    {
      label: 'Политика использования Cookie',
      component: <CookiePolicy />
    },
    {
      label: 'Пользовательское соглашение',
      component: <UsersAgreement />
    },
  ];

  const checkIsActiveTab = (index: number) => index === tab;

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <Box>
            <Box
              display="flex"
              sx={{
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                }
            }}>
              <Box
                p="24px"
                borderRight="1px solid #D9D9D9"
                sx={{
                  display: {
                    xs: 'none',
                    md: 'block',
                  }
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  rowGap="24px"
                >
                  {tabs.map((item, index) => (
                    <Box
                      key={index}
                      whiteSpace="nowrap"
                    >
                      <Box
                        component="span"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setTab(index)}
                        sx={{
                          fontSize: checkIsActiveTab(index) ? '18px' : '16px',
                          fontWeight: checkIsActiveTab(index) ? '600' : 'normal',
                          color: checkIsActiveTab(index) ? 'primary.main' : '',
                        }}
                      >
                        {item.label}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box
                p="24px"
                borderBottom="1px solid #D9D9D9"
                sx={{ 
                  display: {
                    xs: 'block',
                    md: 'none',
                  }
                 }}
              >
                <MobileTabs tabs={tabs} tab={tab} changeTab={setTab} />
              </Box>
              <Box p="24px">
                {tabs[tab].component}
              </Box>
            </Box>
          </Box>
        </RoundedLayout>
      </Container>
    </View>
  );
};

export default Argeements;
