import React from 'react';
import { styled, Tab, Tabs } from "@mui/material";
import ProfileIcon from '../../icons/ProfileIcon.svg';
import ReferalIcon from '../../icons/ReferalIcon.svg';
import RingIcon from '../../icons/RingIcon.svg';
import ExitIcon from '../../icons/ExitIcon.svg';

interface ProfileMobileMenuProps {
  showOnlySelectedTab?: boolean;
  handleChange?: (event: React.SyntheticEvent, value: number) => void;
  mobileTab: number;
}

const ProfileMobileMenu = ({ showOnlySelectedTab, handleChange, mobileTab }: ProfileMobileMenuProps) => {

  const menuTabs = [
    (
      <MobileTab
        icon={<img src={ProfileIcon} alt="" />}
        label="Основное"
        value={0}
      />
    ),
    (
      <MobileTab
        label="Уведомления"
        icon={<img src={RingIcon} alt="" />}
        value={1}
      />
    ),
    (
      <MobileTab
        label="Партнерская программа"
        icon={<img src={ReferalIcon} alt="" />}
        value={2}
      />
    ),
    (
      <MobileTab
        label="Выход"
        icon={<img src={ExitIcon} alt="" />}
        value={3}
      />
    )];

  return (
    <>
      {
        !showOnlySelectedTab && handleChange ? (
          <StyledMobileTabs
            orientation="vertical"
            onChange={(event, newValue) => handleChange(event, newValue)}
            value={mobileTab}
          >
            {
              menuTabs.filter((tab, idx) => mobileTab !== idx)
            }
          </StyledMobileTabs>
        ) : (
          menuTabs.filter((tab, idx) => mobileTab === idx)
        )
      }
    </>
  )


}

export default ProfileMobileMenu;




const MobileTab = styled(Tab)`
  display: flex;
  color: #A5A5A5;
  text-transform: none;
  gap: 10px;
  flex-direction: row;
  min-height: auto;
`;


const StyledMobileTabs = styled(Tabs)`
  & .MuiTabs-indicator {
    width: 0;
  }
  & .MuiButtonBase-root{
    justify-content: flex-start;
    text-transform: none;
    display: flex;
    flex-direction: row;
    gap: 10px;
    min-height: auto;
    padding: 22px 22px 0px 22px;
    width: 100%;
    color: #A5A5A5;
  }
`;