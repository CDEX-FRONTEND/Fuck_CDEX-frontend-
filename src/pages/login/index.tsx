import React from 'react';
import LoginForm from './LoginForm';
import Register from './Register';
import View from '../../components/View';
import Toolbar from '../../components/Toolbar';
import Recovery from './Recovery';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { Box, Card, Container, useTheme } from '@mui/material';
import HomepageBackground from '../../assets/images/homepageBackground.png';
import { useParams } from 'react-router';


export const Login = () => {
  const { authenticated } = useAuth();
  const { referral } = useParams<{ referral: string | undefined }>();
  const theme = useTheme();
  if (authenticated) {
    return <Redirect to="/profile" />;
  }

  const backgroundStyles = {
    background: 'url(' + HomepageBackground + ') center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
  };

  return (
    <View>
      <Toolbar />
      <Box
        style={{ backgroundColor: '#fefaf4' }}
        sx={{
          height: '100%',
          [theme.breakpoints.between('xs', 'lg')]: backgroundStyles,
        }}
      >
        <Container sx={{ height: '100%' }}>
          <Box
            sx={{
              minHeight: '100%',
              [theme.breakpoints.up('lg')]: backgroundStyles,
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box sx={{
              width: {
                sm: '290px',
                md: '430px',
              }
            }}
              m="40px auto"
              boxShadow='0px 4px 48px rgba(0, 0, 0, 0.1)'
              borderRadius='36px'
            >
              <Card
                style={{
                  borderRadius: '36px',
                  padding: '30px',
                }}
              >
                <Switch>
                  <Route exact path="/login" component={LoginForm} />
                  <Route exact path="/login/recovery" component={Recovery} />
                  <Route
                    path="/login/register"
                    component={Register}
                  />
                  <Route
                    path="/login/register/:referral"
                    component={Register}
                  />
                </Switch>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </View >
  );
};
