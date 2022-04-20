import React, { useState, useEffect, useCallback } from 'react';
import RoundedLayout from '../../components/RoundedLayout';
import View from '../../components/View';
import useAppSelector from '../../hooks/useAppSelector';
import { selectUser } from '../../store/userSlice';
import MyProfile from './my-profile';
import ProfileIcon from '../../icons/ProfileIcon.svg';
import ReferalIcon from '../../icons/ReferalIcon.svg';
import RingIcon from '../../icons/RingIcon.svg';
import ExitIcon from '../../icons/ExitIcon.svg';
import ShowMoreIcon from '../../icons/ShowMoreIcon.svg';
import Notifications from './notifications';
import Toolbar from '../../components/Toolbar';
import { SuccessPopup } from '../../components/SuccessPopup';
import { ErrorPopup } from '../../components/ErrorPopup';
import {
  selectError,
  selectPasswordRecoveryLinkSend,
  selectPasswordRecoverySuccess,
  setPasswordRecoverySuccess,
} from '../../store/authSlice';
import useAppDispatch from '../../hooks/useAppDispatch';
import usePopup from '../../hooks/usePopup';
import PartnerProgram from './partner-program';
import { setError } from '../../store/otcSlice';
import { Redirect } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Container,
  Tab,
  styled,
  Popover,
  tabClasses,
  Tabs,
} from '@mui/material';
import { TabPanel } from '../../components/TabPanel';
import { SidebarCard } from './SidebarCard';
import ProfileMobileMenu from './ProfileMobileMenu';

const Profile = () => {
  const { authenticated, logout } = useAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [tab, setTab] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPopover = Boolean(anchorEl);
  const { setPopup } = usePopup();
  const error = useAppSelector(selectError);
  const successPasswordRecoveryLinkSend = useAppSelector(
    selectPasswordRecoveryLinkSend
  );
  const successRecoveryPassword = useAppSelector(selectPasswordRecoverySuccess);
  //const history = useHistory();

  useEffect(() => {
    return () => {
      dispatch(setError(null));
      dispatch(setPasswordRecoverySuccess(false));
      dispatch(setPasswordRecoverySuccess(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => setPopup(null)}
          errorMessage={error.message}
        />
      );
    }
  }, [error]);

  useEffect(() => {
    if (successPasswordRecoveryLinkSend) {
      // TODO: сделать редирект на форму восстановления пароля
      // setPopup(
      //   <Overlay onClick={() => setPopup(null)}>
      //     <Popup onClose={() => setPopup(null)}>
      //       <RecoveryForm />
      //     </Popup>
      //   </Overlay>
      // );
    }
  }, [successPasswordRecoveryLinkSend]);

  useEffect(() => {
    if (successRecoveryPassword) {
      setPopup(
        <SuccessPopup
          onClose={() => setPopup(null)}
          message='Пароль успешно изменен!'
        />
      );
    }
  }, [successRecoveryPassword]);

  const onChangeTab = useCallback((event, tab) => {
    setAnchorEl(null);
    switch (tab) {
      case 0:
      case 1:
      case 2:
        setTab(tab);
        break;
      case 3:
        logout();
        break;
    }
  }, []);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };



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
            sx={{
              flexDirection: {
                sm: 'column',
                lg: 'row',
              },
            }}
          >
            <Box
              flex="1"
              sx={{
                display: {
                  sm: 'flex',
                  lg: 'unset',
                },
                justifyContent: {
                  sm: 'space-between',
                },
                padding: {
                  sm: '24px 24px 21px 24px',
                  lg: '24px 36px 24px 24px',
                },
                flexDirection: {
                  sm: 'column',
                  md: 'row',
                },
              }}
            >
              <SidebarCard
                name={user?.name}
                verified={user?.isVerifiedKYC || null}
              />

              <Box
                sx={{
                  mt: {
                    sm: '0px',
                    lg: '34px',
                  },
                }}
              >
                <Box
                  sx={{
                    display: {
                      sm: 'none',
                      lg: 'block',
                    },
                    pl: {
                      sm: '0px',
                      lg: '10px',
                    },
                  }}
                >
                  <StyledTabs
                    variant="standard"
                    orientation="vertical"
                    onChange={onChangeTab}
                    value={tab}
                  >
                    <StyledTab
                      icon={<img src={ProfileIcon} alt="" />}
                      label="Основное"
                      value={0}
                    />
                    <StyledTab
                      label="Уведомления"
                      icon={<img src={RingIcon} alt="" />}
                      value={1}
                    />
                    <StyledTab
                      label="Партнерская программа"
                      icon={<img src={ReferalIcon} alt="" />}
                      value={2}
                    />
                    <StyledTab
                      label="Выход"
                      icon={<img src={ExitIcon} alt="" />}
                      value={3}
                    />
                  </StyledTabs>
                </Box>

                <Box
                  sx={{
                    display: {
                      sm: 'block',
                      lg: 'none',
                    },
                    paddingTop: {
                      sm: '18px',
                      md: '10px',
                      lg: '0px',
                    },
                  }}
                >
                  <Box
                    onClick={handleClick}
                    sx={{
                      filter:
                        'invert(160%) sepia(50%) saturate(290%) hue-rotate(354deg) brightness(120%) contrast(200%)',
                    }}
                    color='#A5A5A5'
                  >
                    <ProfileMobileMenu
                      showOnlySelectedTab={true}
                      mobileTab={tab}
                    />

                    <span style={{ paddingLeft: '5px' }}>
                      <img src={ShowMoreIcon} alt="" />
                    </span>
                  </Box>

                  <Popover
                    sx={{
                      '& .MuiPopover-paper': {
                        minWidth: {
                          sm: '244px',
                          md: '267px',
                        },
                        borderRadius: '20px',
                      },
                    }}
                    open={openPopover}
                    onClose={() => setAnchorEl(null)}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                  >
                    <Box pb='20px'>
                      <ProfileMobileMenu
                        handleChange={(event, newValue) => onChangeTab(event, newValue)}
                        mobileTab={tab}
                      />
                    </Box>
                  </Popover>
                </Box>
              </Box>
            </Box>

            <Box
              flex="3"
              sx={{
                borderLeft: {
                  lg: '1px solid  #D9D9D9',
                },
                borderTop: {
                  sm: '1px solid  #D9D9D9',
                  lg: 'none',
                },
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              <TabPanel value={tab} index={0}>
                <MyProfile />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <Notifications />
              </TabPanel>
              <TabPanel value={tab} index={2}>
                <PartnerProgram />
              </TabPanel>
            </Box>
          </Box>
        </RoundedLayout>
      </Container>
    </View>
  );
};

const StyledTabs = styled(Tabs)`
  & .MuiTabs-indicator {
    width: 0;
  }
  & .MuiButtonBase-root{
    justify-content: flex-start;
    text-transform: none;
    padding-bottom: 20px;
    color: #A5A5A5;
  }
`;


const StyledTab = styled(Tab)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '10px',
  minHeight: 'auto',
  textTransform: 'none',
  textAlign: 'left',
  color: '#A5A5A5',
  marginLeft: '0px !important',
  fontWeight: 'normal',
  '&.Mui-selected': {
    color: '#A5A5A5',
    fontWeight: 'bold',
    filter: 'invert(90%) sepia(50%) saturate(270%) hue-rotate(354deg) brightness(155%) contrast(100%)'
  },
}));


export default Profile;
