import Toolbar from '../../components/Toolbar';
import View from '../../components/View';
import featureImage1 from '../../icons/HomePageFeaturesFirstIcon.svg';
import featureImage2 from '../../icons/HomePageFeaturesSecondIcon.svg';
import featureImage3 from '../../icons/HomePageFeaturesThirdIcon.svg';
import featureImage4 from '../../icons/HomePageFeaturesFourthIcon.svg';
import featureImage5 from '../../icons/HomePageFeaturesFifthIcon.svg';
import HomepageListMarker from '../../icons/HomepageListMarker.svg';
// import LogoInverted from '../../icons/LogoInvertedIcon.svg';
import { Link } from 'react-router-dom';
import { Container, Box, styled, Grid } from '@mui/material';
import HomepageBackground from '../../assets/images/homepageBackground.png';
import moment from 'moment';

const features = [
  { icon: featureImage1, content: 'Соблюдены все процедуры KYC' },
  { icon: featureImage2, content: 'Много локальных методов оплаты' },
  { icon: featureImage3, content: 'Низкая комиссия площадки' },
  { icon: featureImage4, content: 'Пользовательский сервис 24/7' },
  { icon: featureImage5, content: 'Большое сообщество' },
];

const clients = [
  {
    name: 'Трейдер',
    options: [
      'Пользовательский сервис 24/7',
      'Удобные методы пополнения и вывода',
      'Понятная система учета',
      'Поддержка 24/7',
    ],
  },
  {
    name: 'Майнер',
    options: [
      'Прозрачные процедуры KYC',
      'Выплаты на любые реквизиты',
      'Удобная статистика',
      'Надежное хранение цифровых активов',
    ],
  },
  {
    name: 'Обменник',
    options: [
      'Дополнительный трафик',
      'Обмен ликвидностью',
      'Быстрый запуск бизнеса на готовом решении',
      'Предоставляем пеймент методы',
    ],
  },
];

const Home = () => {
  return (
    <View>
      <Toolbar />
      <Box>
        <Box
          style={{
            backgroundColor: '#fefaf4',
          }}
        >
          <Box
            pb="20px"
            style={{
              background: 'url(' + HomepageBackground + ') top center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              alignItems: 'flex-start',
            }}
          >
            <Container>
              <Box
                fontWeight="bold"
                textAlign="center"
                sx={{
                  padding: {
                    sm: '110px 16px 58px 16px',
                    md: '202px 46px 80px 46px',
                    lg: '202px 0 80px 0',
                  },
                  fontSize: {
                    sm: '24px',
                    md: '44px',
                    lg: '54px',
                  },
                }}
              >
                Совершайте сделки по обмену – легко, быстро и с максимальным
                профитом
              </Box>
              <Box
                style={{
                  display: 'flex',
                  overflowX: 'auto',
                  justifyContent: 'center'
                }}
                sx={{
                  marginBottom: {
                    sm: '40px',
                    lg: '80px',
                  },
                  flexDirection: {
                    sm: 'column',
                    md: 'row'
                  },
                  flexWrap:{
                    sm: 'nowrap',
                    md: 'wrap',
                    lg: 'nowrap'
                  },


                  gap: {
                    sm: '12px',
                    md: '16px'
                  }
                }}
              >
                  {features.map((feature) => (
                    <Box
                      style={{
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        padding: '20px',
                        flexDirection: 'column',
                        gap: '20px',
                        boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.06)'
                      }}
                      sx={{
                        alignItems: {
                          sm: 'left',
                          lg: 'flex-start',
                        },
                        fontSize: {
                          sm: '14px',
                          md: '18px',
                        },
                        borderRadius:{
                          sm: '28px',
                          md: '32px'
                        },
                        flexGrow:{
                          md:'2',
                          lg: '1'
                        },
                        flexBasis:{
                          md: '25%',
                          lg: '250px'
                        },
                      }}
                    >
                      <img
                        src={feature.icon}
                        alt=""
                        style={{
                          width: '32px',
                        }}
                      />
                      {feature.content}
                    </Box>
                  ))}
              </Box>
            </Container>
          </Box>
        </Box>
        <Box
          pt="20px"
          pb="30px"
          style={{
            backgroundColor: '#ffffff',
          }}
        >
          <Container>
            <Box
              fontWeight="bold"
              textAlign="center"
              mt="20px"
              sx={{
                fontSize: {
                  sm: '24px',
                  lg: '36px',
                },
                marginTop: {
                  sm: '64px',
                  md: '80px',
                },
                marginBottom: {
                  sm: '32px',
                  md: '56px',
                },
              }}
            >
              Наши клиенты
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              gap="32px"
              mt="20px"
              mb="20px"
              sx={{
                flexDirection: {
                  sm: 'column',
                  lg: 'row',
                },
                fontSize: {
                  sm: '16px',
                  md: '18px',
                },
              }}
            >
              {clients.map((client) => (
                <Box
                  style={{
                    backgroundColor: '#f8f8f8',
                  }}
                  borderRadius="36px"
                  p="30px"
                >
                  <Box
                    color="#cba977"
                    fontSize="24px"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{
                      textAlign: {
                        lg: 'center',
                        sm: 'left',
                      },
                      fontSize: {
                        sm: '20px',
                        md: '28px',
                      },
                    }}
                  >
                    {client.name}
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    sx={{
                      marginTop: {
                        sm: '24px',
                        md: '32px',
                      }
                    }}
                  >
                    {client.options.map((option) => (
                      <Box display="flex" gap="10px">
                        <img
                          src={HomepageListMarker}
                          style={{
                            width: 8
                          }}
                          alt=""
                        />
                        {option}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        <Box
          style={{
            backgroundColor: '#ffffff',
          }}
          pt="20px"
          pb="20px"
        >
          <Container>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                flexDirection: {
                  sm: 'column',
                  lg: 'row',
                },
                gap: {
                  sm: '20px',
                  lg: 0,
                },
                alignItems: {
                  sm: 'flex-start',
                  md: 'center',
                  lg: 'flex-start',
                },
              }}
            >
              {/* <img src={LogoInverted} alt="" /> */}
              <Box
                display="flex"
                sx={{
                  flexDirection: {
                    sm: 'column',
                    md: 'row',
                  },
                  gap: {
                    sm: '32px',
                    md: '50px',
                  },
                }}
              >
                <StyledLink to="/actives">Биржа</StyledLink>
                <StyledLink to="/otc">P2P</StyledLink>
              </Box>
            </Box>
            <Box
              color="#a8a8a8"
              mt="45px"
              p="16px 0"
            >
              © {moment(new Date()).format('YYYY')}
            </Box>
          </Container>
        </Box>
      </Box>
    </View>
  );
};

const StyledLink = styled(Link)`
  color: #000000;
  font-size: 18px;
  text-decoration: none;
`;

export default Home;
