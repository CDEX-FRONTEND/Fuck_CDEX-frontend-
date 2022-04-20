import styled from '@emotion/styled';
import { Box } from '@mui/material';
import classNames from 'classnames';
import React, { FC } from 'react';
import styles from './style.module.scss';

interface IAuthProgressProps {
  level: number;
}

const AuthenticationProgress: FC<IAuthProgressProps> = ({ level }) => {
  return (
    <AuthProgressContainer>
      {Array.from(Array(2).keys()).map((i) => (
        <div
          className={classNames({
            [styles['AuthenticationProgress-rect']]: true,
            [styles[`AuthenticationProgress-rect--level-${level}`]]: level > i,
          })}
        ></div>
      ))}
    </AuthProgressContainer>
  );
};

const AuthProgressContainer = styled(Box)`
  padding: 5px;
  display: flex;
  gap: 10px;
`;

export default AuthenticationProgress;
