import React, { useState, Suspense } from 'react';
import { Box } from '@mui/material';

import DownArrowIconGold from '../../icons/DownArrowIconGold.svg';

const PopperContainer = React.lazy(() => import('../../components/PopperContainer'));

interface MobileTabsProps {
  tabs: Array<any>;
  tab: number;
  changeTab: React.Dispatch<React.SetStateAction<number>>;
}

const MobileTabs = ({ tabs, tab, changeTab }: MobileTabsProps) => {
  const [showPopper, setShowPopper] = useState(false);

  return (
    <Box
      display="flex"
      position="relative"
    >
      <Box
        display="flex"
        alignItems="center"
        columnGap="9px"
        fontSize="14px"
        fontWeight="500"
        sx={{
          color: 'primary.main',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: '26px',
        }}
        onClick={() => setShowPopper(true)}
      >
        {tabs[tab].label}
        <img width="11px" height="7px" alt="" src={DownArrowIconGold} />
      </Box>
      {showPopper && (
        <Suspense fallback={null}>
          <PopperContainer show={showPopper} onClose={() => setShowPopper(false)}>
          <Box
            display="flex"
            rowGap="20px"
            flexDirection="column"
            fontSize="14px"
          >
            {tabs
              .filter(item => item.label !== tabs[tab].label)
              .map((item, index) => (
                <Box
                  key={index}
                  fontWeight="500"
                >
                  <Box
                    component="span"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      changeTab(tabs.findIndex(tab => item.label === tab.label));
                      setShowPopper(false);
                    }}
                  >
                    {item.label}
                  </Box>
                </Box>
              ))
            }
          </Box>
          </PopperContainer>
        </Suspense>
      )}
    </Box>
  );
}

export default MobileTabs;