/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState } from 'react';
import { generatePath, useHistory } from 'react-router';
import CalendarIcon from '../../../icons/CalendarIcon.svg';
import TimeToReadIcon from '../../../icons/TimeToReadIcon.svg';
import CommentsIcon from '../../../icons/CommentsIcon.svg';
import SubscriptionFormLgImage from '../../../assets/images/SubscriptionFormLg.png';
import SubscriptionFormMdImage from '../../../assets/images/SubscriptionFormMd.png';
import GoldenFrontArrowIcon from '../../../icons/GoldenFrontArrowIcon.svg';
import PagingSpacerIcon from '../../../icons/PagingSpacerIcon.svg';
import { Box, styled } from "@mui/material";
import itemsList, { IPopularItem } from './itemsList';

const KnowledgeCenterPopular: React.FC = () => {
  const history = useHistory();
  const [emailForSubscr, setEmailForSubscr] = useState('');


  const goToSelectedItem = (item: IPopularItem) => {
    history.push(
      generatePath('/knowledge-center/popular/:id', {
        id: `${item.id}`,
      })
    );
  };

  const confirmSubscr = (e: any) => {
    setEmailForSubscr('');
  };

  const subscriptionFormElement = (
    <Box
      mb="36px"
      minHeight="112px"
      borderRadius="24px"
      sx={{
        backgroundColor: '#5c50ae',
        backgroundRepeat: 'no-repeat',
        backgroundImage: {
          xs: `url(${SubscriptionFormMdImage})`,
          md: `url(${SubscriptionFormLgImage})`,
        },
        backgroundPosition: {
          xs: '100% 100%',
          md: '80% 62%',
        },
        padding: {
          xs: '28px 16px',
          md: '28px 24px',
        },
        boxSizing: 'border-box',
      }}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    flexWrap="wrap"
    rowGap="20px"
    >
    <Box
      fontWeight="bold"
      color="white"
      fontStyle="normal"
      lineHeight="140%"
      sx={{
        maxWidth: {
          xs: '300px',
          md: '357px',
        },
        fontSize: {
          xs: '16px',
          md: '20px',
        }
      }}
    >
      Подпишись на дайджест новостей о криптовалютном мире
    </Box>
    <Box
      position="relative"
      sx={{
        maxWidth: {
          xs: '270px',
          md: '361px',
        },
        width: '100%',
        '&:after': {
          content: '""',
          position: 'absolute',
          marginTop: '12px',
          top: '0',
          bottom: '0',
          right: '14px',
          width: '25px',
          height: '25px',
          backgroundSize: 'cover',
          background: `url(${GoldenFrontArrowIcon}) no-repeat`,
        },
      }}
      onClick={confirmSubscr}
    >
      <SubscribtionFormInput
        value={emailForSubscr}
        onChange={(e) => setEmailForSubscr(e.target.value)}
        type="text"
        placeholder="Электронная почта"
      />
    </Box>
    </Box>
  );

  const getItemInfo = (item: IPopularItem) => [
    {
      src: CalendarIcon,
      data: item.date,
    },
    {
      src: TimeToReadIcon,
      data: item.timeToRead,
    },
    {
      src: CommentsIcon,
      data: item.commentCount,
    },
  ];

  const popularItemsElement = itemsList.map((item) => {
    return (
      <Box
        key={item.id}
        display="flex"
        flexDirection="column"
      >
        <Box
          sx={{
            backgroundImage: `url(${item.img})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: '24px',
            height: '0',
            width: '100%',
            paddingTop: {
              xs: '58%',
              md: '39.83%'
            },
          }}
        />
        <Box
          display="flex"
          color="#8F8982"
          margin="23px 0px 23px 0px"
          flexWrap="wrap"
          columnGap="40px"
        >
          {getItemInfo(item).map(({ src, data }, index) => (
            <Box
              key={index}
              display="flex"
              lineHeight="30px"
              alignItems="center"
            >
              <ItemInfoImg alt="" src={src} /> {data}
            </Box>
          ))}
        </Box>
        <div>
          <Box
            mb="16px"
            fontWeight="bold"
            sx={{
              fontSize: {
                xs: '20px',
                md: '28px',
              }
            }}
          >
            {item.label}
          </Box>
          <Box
            fontSize="16px"
            lineHeight="24px"
          >
            {item.content}
          </Box>
        </div>
        <Box
          m="24px 0px 32px 0px"
          display="flex"
          alignItems="center"
        >
          <BtnReadMore
            style={{ cursor: 'pointer' }}
            onClick={() => goToSelectedItem(item)}
          >
            Читать полностью
          </BtnReadMore>
          <img
            src={GoldenFrontArrowIcon}
            alt=""
            style={{ cursor: 'pointer' }}
            onClick={() => goToSelectedItem(item)} />
        </Box>
      </Box>
    );
  });

  const pagingNavigation = (
    <Box
      display="flex"
    >
      <PagingItemSelected>1</PagingItemSelected>
      <PagingItem>2</PagingItem>
      <PagingItem>3</PagingItem>
      <PagingSpacer>
        {' '}
        <img alt="" src={PagingSpacerIcon} />{' '}
      </PagingSpacer>
      <PagingItem>48</PagingItem>
    </Box>
  );

  return (
    <>
      {subscriptionFormElement}
      {popularItemsElement}
      {pagingNavigation}
    </>
  );
};

const ItemInfoImg = styled('img')`
  margin-right: 10px;
`;

const PagingItem = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
  font-size: 14px;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  box-sizing: border-box;
  background-color: #f5f5f5;
  line-height: 21px;

  &:last-child {
    margin-right: 0;
  }
`;

const PagingItemSelected  = styled(PagingItem)`
  color: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  font-weight: 500;
  background: none;
`;

const SubscribtionFormInput = styled('input')`
  height: 41px;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(30px);
  border-radius: 16px;
  border: none;
  padding-left: 20px;
  padding-right: 42px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
  }
  &::placeholder {
    font-size: 14px;
    line-height: 21px;
  }
`;

const BtnReadMore = styled(Box)`
  padding-right: 18px;
  color: ${(props) => props.theme.palette.primary.main};
  font-size: 18px;
  line-height: 24px;
`;

const PagingSpacer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 14px;
`;

export default KnowledgeCenterPopular;
