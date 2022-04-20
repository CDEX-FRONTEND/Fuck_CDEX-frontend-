import React from 'react';
import RoundedLayout from '../../components/RoundedLayout';
import View from '../../components/View';
import Toolbar from '../../components/Toolbar';
import { Box, Container } from '@material-ui/core';
import styled from '@emotion/styled';

const NotFound = () => {
  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <Wrapper>
            Страница не найдена
          </Wrapper>
        </RoundedLayout>
      </Container>
    </View>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 60px;
  font-size: 36px;
  color: rgb(153, 153, 153);
`;

export default NotFound;
