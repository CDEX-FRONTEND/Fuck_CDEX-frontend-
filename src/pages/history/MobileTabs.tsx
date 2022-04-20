import React, { useState, Suspense } from 'react';
import { Box } from '@mui/material';

import DownArrowIconGold from '../../icons/DownArrowIconGold.svg';

const PopperContainer = React.lazy(() => import('../../components/PopperContainer'));

interface MobileTabsProps {
  tabs: Array<string>,
  tab: number,
  setTab: React.Dispatch<React.SetStateAction<number>>,
}

const MobileTabs = ({ tabs, tab, setTab }: MobileTabsProps) => {
  const [showPopper, setShowPopper] = useState(false);

  return (
    <Box position="relative">
      <Box
        display="flex"
        alignItems="center"
        columnGap="9px"
        style={{ cursor: 'pointer' }}
        sx={{
          color: 'primary.main',
          fontSize: '16px !important',
          fontWeight: 'bold',
        }}
        onClick={() => setShowPopper(true)}
      >
        {tabs[tab]}
        <img width="11px" height="7px" alt="" src={DownArrowIconGold} />
      </Box>
      {showPopper && (
        <Suspense fallback={null}>
          <PopperContainer show={showPopper} onClose={() => setShowPopper(false)}>
            <Box
              display="flex"
              flexDirection="column"
              rowGap="15px"
            >
              {tabs
                .filter((_, index) => index !== tab)
                .map((item, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      setTab(tabs.findIndex(it => it === item));
                      setShowPopper(false);
                    }}
                    fontSize="16px !important"
                    whiteSpace="nowrap"
                    style={{ cursor: 'pointer', color: '#9E9E9E' }}
                  >
                    {item}
                  </Box>
              ))}
            </Box>
          </PopperContainer>
        </Suspense>
      )}
    </Box>
  );
}

export default MobileTabs;