import React, { useState, Suspense } from 'react';
import { Box } from '@mui/material';

import TabItem from './TabItem';
import DownArrowIconGold from '../../icons/DownArrowIconGold.svg';

const PopperContainer = React.lazy(() => import('../../components/PopperContainer'));

interface ITab {
  label: string;
  component?: JSX.Element;
  path?: string;
  icon: {
    default: string;
    active: string;
  };
}

interface MobileTabsProps {
  tabs: ITab[];
  tab: ITab | undefined;
  changeCurrentTab: (tab: ITab) => void;
}

const MobileTabs = ({ tabs, tab, changeCurrentTab }: MobileTabsProps) => {
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
        style={{ cursor: 'pointer' }}
        onClick={() => setShowPopper(true)}
      >
        <Box display="table">
          {tab && (
            <TabItem
              label={tab.label}
              icon={tab.icon.active}
              isActive={true}
            />
          )}
        </Box>
        <img width="11px" height="7px" alt="" src={DownArrowIconGold} />
      </Box>
      {showPopper && (
        <Suspense fallback={null}>
          <PopperContainer show={showPopper} onClose={() => setShowPopper(false)}>
            <Box display="table">
              {tabs
                .filter(item => item.label !== tab?.label)
                .map((item, index) => (
                  <TabItem
                    key={index}
                    label={item.label}
                    icon={item.icon.default}
                    isActive={false}
                    onClick={() => changeCurrentTab(item)}
                  />
                ))}
            </Box>
          </PopperContainer>
        </Suspense>
      )}
    </Box>
  );
}

export default MobileTabs;