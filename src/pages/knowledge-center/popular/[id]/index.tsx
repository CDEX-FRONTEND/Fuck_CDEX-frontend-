import React from 'react';
import { Container, Box, styled } from "@mui/material";
import { useParams, useHistory, generatePath, Redirect } from 'react-router';
import View from '../../../../components/View';
import RoundedLayout from '../../../../components/RoundedLayout';
import Toolbar from '../../../../components/Toolbar';
import GoldenBackArrowIcon from '../../../../icons/GoldenBackArrowIcon.svg';
import CalendarIcon from './../../../../icons/CalendarIcon.svg';
import TimeToReadIcon from './../../../../icons/TimeToReadIcon.svg';
import CommentsIcon from './../../../../icons/CommentsIcon.svg';
import itemsList, { IPopularItem } from '../itemsList';

const KnowledgeCenterPopularItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const itemData: IPopularItem = itemsList.find(item => item.id === Number(id)) || {};

  if (Object.keys(itemData).length === 0) {
    return <Redirect to="/knowledge-center/popular" />;
  }

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

  const selectItem = (id: number) =>
    history.push(generatePath('/knowledge-center/popular/:id', { id }));

  const onBackBtnClick = () => history.push('/knowledge-center/popular');

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <Box
            display="flex"
            flexDirection="column"
            p="24px"
          >
            <Box
              marginBottom="20px"
              display="flex"
              alignItems="center"
            >
              <img
                src={GoldenBackArrowIcon}
                alt=""
                style={{ cursor: 'pointer' }}
                onClick={onBackBtnClick}
              />
              <BackButton
                onClick={onBackBtnClick}
                style={{ cursor: 'pointer' }}
              >
                Вернуться назад
              </BackButton>
            </Box>
            <Box
              mb="24px"
              fontWeight="600"
              sx={{
                fontSize: {
                  xs: '20px',
                  md: '34px',
                }
              }}
            >
              {itemData.label}
            </Box>

            <Box
              display="flex"
              color="#717779"
              m="0px 0px 23px 0px"
              flexWrap="wrap"
              columnGap="40px"
            >
              {getItemInfo(itemData).map(({ src, data }, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  lineHeight="30px"
                >
                  <ItemInfoImg alt="" src={src} /> {data}
                </Box>
              ))}
            </Box>
            <div>
              <Box
                sx={{
                  backgroundImage: `url(${itemData.img})`,
                  backgroundSize: '100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  marginBottom: '22px',
                  height: '0',
                  width: '100%',
                  borderRadius: '24px',
                  paddingTop: {
                    xs: '58%',
                    md: '39.83%'
                  },
                }}
              />
              <Box
                lineHeight="24px"
              >
                {itemData.content}
              </Box>
            </div>
            <Box
              mt="24px"
              ml="-24px"
              mr="-24px"
              p="24px 24px 0 24px"
              borderTop="1px solid #D9D9D9"
            >
              <Box
                fontWeight="600"
                sx={{
                  fontSize: {
                    xs: '16px',
                    md: '28px',
                  }
                }}
              >
                <span>Это может быть интересно</span>
                <Box
                  mt="32px"
                  display="flex"
                  flexDirection="column"
                  rowGap="32px"
                  sx={{
                    maxWidth: {
                      xs: 'auto',
                      md: '600px',
                    }
                  }}
                >
                  {itemsList
                    .filter(item => item.id !== itemData.id)
                    .map((item, index) => (
                    <Box
                      key={index}
                      display="flex"
                      columnGap="24px"
                      rowGap="16px"
                      sx={{
                        flexDirection: {
                          xs: 'column',
                          md: 'row',
                        },
                        alignItems: {
                          xs: 'start',
                          md: 'center',
                        }
                      }}
                    >
                      <Box
                        sx={{
                          backgroundImage: `url(${item.img})`,
                          backgroundSize: '100%',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          borderRadius: '12px',
                          flexShrink: '0',
                          paddingTop: {
                            xs: '58%',
                            md: '0',
                          },
                          height: {
                            xs: '0%',
                            md: '112px',
                          },
                          width: {
                            xs: '100%',
                            md: '180px',
                          },
                          cursor: 'pointer',
                        }}
                        onClick={() => selectItem(item.id)}
                      />
                      <Box
                        component="span"
                        sx={{
                          fontSize: {
                            xs: '16px',
                            md: '18px',
                          },
                          lineHeight: '26px',
                          cursor: 'pointer',
                        }}
                        onClick={() => selectItem(item.id)}
                      >
                        {item.label}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </RoundedLayout>
      </Container>
    </View>
  );
};

const ItemInfoImg = styled('img')`
  margin-right: 10px;
`;

const BackButton = styled(Box)`
  padding-left: 10px;
  color: #cba977;
  text-transform: none;
  font-size: 16px;
  line-height: 24px;
`;

const InterestingItemImg = styled(Box)`
border-radius: 12px;
`;

export default KnowledgeCenterPopularItem;
