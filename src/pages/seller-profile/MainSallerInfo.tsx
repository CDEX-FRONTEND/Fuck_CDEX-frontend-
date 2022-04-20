import React, { useEffect } from "react";
import { Box, Button, styled, useTheme } from "@mui/material"
import BackButton from "../../components/BackButton";
import { addFavoriteUser, getIsFavoriteUser, removeFavoriteUser, selectIsFavorite, selectUser } from "../../store/userSlice";
import StatisticSellerCard from "./StatisticSellerCard";
import { useHistory } from 'react-router';
import Overlay from "../../components/Overlay";
import Popup from "../../components/Popup";
import FormComplaint from "../complaint";
import usePopup from "../../hooks/usePopup";
import useAppSelector from '../../hooks/useAppSelector';
import useAppDispatch from "../../hooks/useAppDispatch";

import SellerProfileIcon from './../../icons/SellerProfileIcon.svg';
import ConfirmedAccountIcon from './../../icons/ConfirmedAccountIcon.svg';
import { getAdvertisementSellerInfo, selectAdvertisementSellerInfo, setAdvertisementSellerInfo } from "../../store/otcSlice";
import FileComplaintIcon from './../../icons/FileComplaintIcon.svg';
import AddToFavoriteIcon from './../../icons/AddToFavoriteIcon.svg';
import FavoritesIconFilled from '../../icons/FavoritesIconGoldFilled.svg';

interface MainSallerInfoProps {
  userId: string;
}

const MainSallerInfo = ({ userId: sallerId }: MainSallerInfoProps) => {
  const dispatch = useAppDispatch();
  const IsFavoriteUser = useAppSelector(selectIsFavorite);
  const theme = useTheme();
  const history = useHistory();
  const { setPopup } = usePopup();
  const currentUser = useAppSelector(selectUser);
  const user = useAppSelector(selectAdvertisementSellerInfo);

  useEffect(() => {
    dispatch(setAdvertisementSellerInfo(null));
    dispatch(getAdvertisementSellerInfo(sallerId));
    dispatch(
      getIsFavoriteUser({
        userIds: [sallerId],
      })
    );
  }, [sallerId]);

  const addUserToFavorite = () => {
    dispatch(addFavoriteUser(sallerId)).then(() => {
      dispatch(
        getIsFavoriteUser({
          userIds: [sallerId],
        })
      );
    });
  };

  const removeUserFromFavorite = () => {
    dispatch(removeFavoriteUser(sallerId)).then(() => {
      dispatch(
        getIsFavoriteUser({
          userIds: [sallerId],
        })
      );
    });
  };

  const openComplaintForm = () => {
    return setPopup(
      <Overlay onClick={() => setPopup(null)}>
        <Popup
          title="Что случилось?"
          onClose={() => setPopup(null)}
        >
          <FormComplaint />
        </Popup>
      </Overlay>
    );
  };

  return (

    <Box display='flex' flexDirection='column' p='24px 0px 0px 0px'>
      <Box display='flex'
        flexDirection='column'
        p="0px 24px"
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '10px',
          flexDirection: {
            sm: 'column',
            lg: 'row'
          }
        }}>
          <Box sx={{
            display: 'flex',
            flex: '0.2',
            ml: '-10px',
            pb: '10px'
          }}>

            <BackButton onClick={() => history.goBack()} text='' />

            <StyledButton>
              <Box ml='-14px' mr='14px'>
                <img alt="" src={SellerProfileIcon} />
              </Box>
              <Box mr='14px' color='black'> {user?.name} </Box>
              {user?.userIsVerified ? (
                <Box>
                  <img alt="" src={ConfirmedAccountIcon} />
                </Box>
              ) : (
                <></>
              )}
            </StyledButton>
          </Box>

          <Box display='flex' sx={{
            justifyContent: {
              sm: 'flex-start',
              lg: 'space-between'
            },
            flexDirection: {
              sm: 'column',
              md: 'row'
            }
          }}>
            {currentUser?.id === sallerId ? (
              <></>
            ) : (
              <>
                <StyledButton
                  sx={{
                    color: theme.palette.secondary.dark
                  }}
                  onClick={openComplaintForm}
                >
                  <img
                    src={FileComplaintIcon}
                    alt=""
                    style={{ marginRight: '10px' }}
                  />
                  Подать жалобу
                </StyledButton>
                <Box pb='10px'> </Box>

                {IsFavoriteUser[0]?.isFavorite ? (
                  <>
                    <StyledButton
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold'
                      }}
                      onClick={removeUserFromFavorite}
                    >
                      <img
                        src={AddToFavoriteIcon}
                        alt="back"
                        style={{ marginRight: '10px' }}
                      />
                      Добавлен
                    </StyledButton>
                  </>
                ) : (
                  <>
                    <StyledButton
                      sx={{ color: theme.palette.secondary.dark }}
                      onClick={addUserToFavorite}
                    >
                      <img
                        src={FavoritesIconFilled}
                        alt="back"
                        style={{ marginRight: '10px' }}
                      />
                      Добавить в избранное
                    </StyledButton>
                  </>
                )}

              </>
            )}
          </Box>
        </Box>

        <Box display='flex' flex='1' sx={{
          flexDirection: {
            sm: 'column',
            md: 'row'
          }
        }}>
          <StatisticSellerCard
            label='Успешные сделки'
            value={`${user?.countComplete || '-'}/${user?.countTotal || '-'}`}
          />
          <Box sx={{
            pb: {
              sm: '16px',
              md: '0px'
            }
          }}> </Box>
          <StatisticSellerCard
            label='Среднее время перевода'
            value={`${user?.averagePaymentTime || '-'}`}
          />
        </Box>

      </Box>
      <Divider />
    </Box>
  )

}

export default MainSallerInfo;


const StyledButton = styled(Button)((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  lineHeight: '100%',
  textTransform: 'none',
  paddingRight: '20px',
  '&:last-of-type': {
    paddingRight: '0px',
  },
  [props.theme.breakpoints.down("md")]: {
    justifyContent: 'flex-start',
  },
  [props.theme.breakpoints.down("sm")]: {
    justifyContent: 'flex-start',
  }
}));

const Divider = styled(Box)`
  border-bottom: 1px solid #d9d9d9;
  padding-top: 24px;
`;
