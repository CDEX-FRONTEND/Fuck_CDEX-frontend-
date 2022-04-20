import React, { useEffect } from 'react';
import View from '../../components/View';
import Toolbar from '../../components/Toolbar';
import RoundedLayout from '../../components/RoundedLayout';
import {
  selectError,
  selectConfirmEmail,
  setConfirmEmail,
  confirmEmail,
  setError,
} from '../../store/authSlice';
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from '../../hooks/useAppDispatch';
import { useHistory } from 'react-router';
import { SuccessPopup } from '../../components/SuccessPopup';
import { ErrorPopup } from '../../components/ErrorPopup';
import usePopup from '../../hooks/usePopup';
import { useQuery } from '../../hooks/useQuery';
import { Container, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'react-router-dom';

const Confirmation = () => {
  const { authenticated } = useAuth();
  const { setPopup } = usePopup();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const token = query.get('token');
  const history = useHistory();

  useEffect(() => {
    if (token) {
      dispatch(confirmEmail(token));
    } else {
      history.push('/login');
    }
  }, []);
  
  const error = useAppSelector(selectError);
  const successConfirmed = useAppSelector(selectConfirmEmail);

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            setPopup(null);
            setError(null);
          }}
          errorMessage={error.message}
        />
      );
    }
  }, [error]);

  const onClosePopup = () => {
    setPopup(null);
    dispatch(setConfirmEmail(false));
  };

  useEffect(() => {
    if (successConfirmed) {
      setTimeout(() => history.push('/login'), 2500);
      setPopup(
        <SuccessPopup
          onClose={onClosePopup}
          message="Ваш email подтверждён!"
        />
      );
    }
  }, [successConfirmed]);

  if (authenticated) {
    return <Redirect to="/" />;
  }

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <div
            style={{
              padding: '60px',
              textAlign: 'center',
            }}
          >
            Подождите...
          </div>
        </RoundedLayout>
      </Container>
    </View>
  );
};

export default Confirmation;
