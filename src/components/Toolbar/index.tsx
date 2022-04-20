import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import useAppSelector from '../../hooks/useAppSelector';
import { checkRoles } from '../../lib/checkRoles';
import { selectUser } from '../../store/userSlice';
import Logo from '../../icons/Logo.svg';
import ProfileIcon from '../../icons/ProfileIcon.svg';
import ActivesIcon from '../../icons/ActivesIcon.svg';
import HistoryIcon from '../../icons/HistoryIcon.svg';
import KnowledgeCenterIcon from '../../icons/KnowledgeCenterIcon.svg';
import FakeIcon from '../../icons/FakeIcon.svg';
import OtcIcon from '../../icons/OtcIcon.svg';
import StockIcon from '../../icons/StockIcon.svg';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Container,
  styled,
  useTheme,
} from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';
import MenuIcon from '../../icons/MenuIcon.svg';
import CloseIcon from '../../icons/CloseIcon.svg';

const Toolbar = () => {
  const { authenticated } = useAuth();
  const history = useHistory();
  const user = useAppSelector(selectUser);
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const theme = useTheme();
  const isActive = useCallback(
    (path: string): boolean => {
      return history.location.pathname.indexOf(path) !== -1;
    },
    [history]
  );

  let menu = [
    {
      path: '/knowledge-center/popular',
      name: 'Центр знаний',
      icon: <img src={KnowledgeCenterIcon} alt="" />,
    },
    {
      path: '/stock',
      name: 'Биржа',
      icon: <img src={StockIcon} alt="" />,
    },
    {
      path: '/otc',
      name: 'P2P',
      icon: <img src={OtcIcon} alt="" />,
    },
    {
      path: '/history',
      name: 'История',
      icon: <img src={HistoryIcon} alt="" />,
    },
    {
      path: '/actives',
      name: 'Активы',
      icon: <img src={ActivesIcon} alt="" />,
    },
    {
      path: '/profile',
      name: user?.name,
      icon: <img src={ProfileIcon} alt="" />,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          height: {
            sm: '58px',
            md: '68px',
            lg: authenticated ? '68px' : '88px',
          },
        }}
      />
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        style={{
          backgroundColor: '#000000',
        }}
        sx={{
          height: {
            lg: authenticated ? '68px' : '88px',
          },
        }}
        zIndex="1000"
      >
        <Container>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              height: {
                sm: '58px',
                md: '68px',
                lg: authenticated ? '68px' : '88px',
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                width: {
                  sm: '100%',
                  lg: 'auto',
                },
              }}
            >
              <Link to="/">
                <img src={Logo} alt="" />
              </Link>

              <Box
                onClick={() => setMenuOpened(!menuOpened)}
                sx={{
                  display: {
                    sm: 'block',
                    lg: 'none',
                  },
                }}
              >
                {menuOpened ? (
                  <img src={CloseIcon} alt="" />
                ) : (
                  <img src={MenuIcon} alt="" />
                )}
              </Box>
            </Box>

            <Box
              sx={{
                zIndex: {
                  md: -1,
                  lg: 'auto',
                },
                height: {
                  sm: '100%',
                  lg: authenticated ? '68px' : '88px',
                },
                position: {
                  sm: 'fixed',
                  lg: 'relative',
                },
                top: {
                  sm: '58px',
                  md: '0',
                },
                left: {
                  sm: '0',
                  lg: '0',
                },
                right: {
                  sm: '0',
                  lg: '0',
                },
                display: {
                  sm: menuOpened ? 'flex' : 'none',
                  lg: 'flex',
                },
              }}
              style={{
                backgroundColor: '#000000',
                transition: '300ms ease all',
              }}
            >
              <Box
                display="flex"
                flex="1"
                sx={{
                  flexDirection: {
                    sm: 'column',
                    lg: 'row',
                  },
                  marginTop: {
                    sm: '12px',
                    lg: 0,
                  },
                  alignItems: {
                    md: 'center',
                    lg: 'stretch',
                  },
                  justifyContent: {
                    md: 'center',
                    lg: 'stretch',
                  }
                }}
              >
                {authenticated ? (
                  <>
                    {user && checkRoles(user?.roles, ['admin', 'operator']) && (
                      <NavItem
                        sx={{
                          display: {
                            sm: 'none',
                            lg: 'block',
                          },
                        }}
                        onClick={() => history.push('/admin')}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap="15px"
                          height="100%"
                        >
                          <img src={FakeIcon} alt="" />
                          <Box fontWeight="bold">Админ</Box>
                        </Box>
                      </NavItem>
                    )}

                    {menu.map(({ path, icon, name }) => (
                      <NavItem
                        onClick={() => {
                          setMenuOpened(false);
                          history.push(path);
                        }}
                        sx={{
                          padding: {
                            sm: '20px 20px 20px 24px',
                            md: '20px 30px 20px 30px',
                            lg: '0',
                          },
                        }}
                      >
                        <Box
                          display="flex"
                          gap="10px"
                          alignItems="center"
                          height="100%"
                          sx={{
                            justifyContent: {
                              lg: 'center',
                            },
                            filter:
                              isActive(path) ?
                                'invert(90%) sepia(50%) saturate(270%) hue-rotate(354deg) brightness(155%) contrast(100%)'
                                : '',
                          }}
                        >
                          {icon}
                          <Box fontWeight="bold">
                            {name}
                          </Box>
                        </Box>
                      </NavItem>
                    ))}
                  </>
                ) : (
                  <Box
                    sx={{
                      display: {
                        sm: menuOpened ? 'block' : 'none',
                        lg: 'none',
                      },
                    }}
                  >
                    <NavItem onClick={() => {
                      history.push('/login');
                      setMenuOpened(false);
                    }}>
                      <Box p="15px">Войти</Box>
                    </NavItem>
                    <NavItem onClick={() => {
                      history.push('/login/register');
                      setMenuOpened(false);
                    }}>
                      <Box p="15px">Зарегистрироваться</Box>
                    </NavItem>
                  </Box>
                )}
              </Box>
            </Box>

            {!authenticated && (
              <Box display="flex" alignItems="center" gap="10px">
                <NavItem
                  onClick={() => history.push('/login')}
                  sx={{
                    display: {
                      sm: 'none',
                      lg: 'block',
                    },
                  }}
                >
                  Войти
                </NavItem>
                <StyledButton
                  onClick={() => history.push('/login/register')}
                  sx={{
                    display: {
                      sm: 'none',
                      lg: 'block',
                    },
                  }}
                >
                  Зарегистрироваться
                </StyledButton>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const StyledButton = styled(ButtonUnstyled)`
  background-color: #000000;
  color: ${(props) => props.theme.palette.primary.main};
  border-radius: 50px;
  font-weight: 600;
  line-height: 100%;
  border: 2px solid ${(props) => props.theme.palette.primary.main};
  padding: 16px 24px;
  cursor: pointer;
`;

const NavItem = styled(Box)`
  color: #9E9E9E;
  min-width: 125px;
  font-weight: bold;
  cursor: pointer;
`;

export default Toolbar;
