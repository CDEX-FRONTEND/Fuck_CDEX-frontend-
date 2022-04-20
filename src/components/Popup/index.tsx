import React, { FC } from 'react';
import CloseIcon from '../../icons/CloseIcon.svg';
import Overlay from '../Overlay';
import { Box, styled } from '@mui/material';

interface IPopupProps {
  children: any;
  onClose: () => void;
  closeable?: boolean;
  title?: string;
  fixedWidth?: boolean;
}

const Popup: FC<IPopupProps> = ({
  children,
  onClose,
  closeable = true,
  title,
  fixedWidth = true,
}) => {
  return (
    <Overlay onClick={onClose}>
      <PopupContainer>
        <PopupWrap
          sx={{
            ...(fixedWidth ? {
              maxWidth: '517px',
              width: '100%',
            } : {})
          }}
        >
          <PopupWrap2
            sx={{
              margin: {
                xs: '0 16px',
                md: '0',
              },
              padding: {
                xs: '20px',
                md: '40px',
              },
              borderRadius: {
                xs: '28px',
                md: '40px',
              },
            }}
          >
            {(title || closeable) && (
              <Box
                display="flex"
                columnGap="30px"
                alignItems="flex-start"
              >
                {title && (
                  <Box
                    marginRight="auto"
                    sx={{
                      fontSize: {
                        xs: '24px',
                        md: '34px',
                      },
                      lineHeight: {
                        xs: '32px',
                        md: '42px',
                      },
                      fontWeight: 500,
                    }}
                  >
                    {title}
                  </Box>
                )}
                {closeable && (
                    <CloseButton onClick={onClose}>
                      <Box
                        component="span"
                        sx={{
                          display: {
                            xs: 'none',
                            md: 'inline',
                          }
                        }}
                      >
                        Закрыть
                      </Box>
                      <img
                        src={CloseIcon}
                        alt=""
                        style={{
                          width: '16px',
                          height: '16px',
                        }}
                      />
                    </CloseButton>
                )}
              </Box>
            )}
            <Box
              flex="1"
              display="flex" 
              flexDirection="column"
              sx={{
                overflowY: 'auto',
                paddingRight: {
                  xs: '15px',
                  md: '20px'
                },
                marginRight: {
                  xs: '-15px',
                  md: '-20px',
                }
              }}
            >
                {children}
            </Box>
          </PopupWrap2>
        </PopupWrap>
      </PopupContainer>
    </Overlay>
  );
};

const PopupContainer = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const PopupWrap = styled(Box)`
  position: relative;
  min-height: 240px;
  height: 98%;
  z-index: 1001;
  display: flex;
  align-items: center;
`;

const PopupWrap2 = styled(Box)`
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #ffffff;
  box-shadow: 0px 4px 32px rgba(0, 0, 0, 0.12);
  min-height: 240px;
  max-height: 98%;
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  line-height: 24px;
`;

const CloseButton = styled(Box)`
  margin-left: auto;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 17px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export default Popup;
