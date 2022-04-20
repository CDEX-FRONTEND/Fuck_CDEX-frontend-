import { Box, Button, styled } from '@mui/material';
import { createRef, useEffect } from 'react';
import { ChatMessageType } from '../../store/chatSlice';
import EmptyAvatarIcon from '../../icons/EmptyAvatarIconGold.svg';
import DownloadIcon from '../../icons/DownloadIcon.svg';
import { TChatAction } from '../Chat';
import moment from 'moment';

interface ChatMessagesProps<T> {
  messages: T[];
  userId: string;
  actions?: TChatAction[];
  onActionClick?: (index: number) => void;
  fullHeight?: boolean;
}

const ChatMessages = <T extends ChatMessageType>({
  messages,
  userId,
  actions,
  onActionClick,
  fullHeight = false,
}: ChatMessagesProps<T>) => {
  const containerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (messages && messages.length && containerRef.current) {
      // scroll to bottom
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const checkIsServiceUser = (userId: string): boolean =>
    userId === '00000000-0000-0000-0000-000000000000';

  return (
    <Box
      position="relative"
      style={{
        height: 'calc(100% - 100px)',
      }}
      display="flex"
      flexDirection="column"
    >
      <MessagesContainer
        style={{
          flex: fullHeight ? '1' : '',
        }}
        ref={containerRef}
      >
        {messages.map((message: T) => (
          <MessageContainer>
            <Box
              key={message.id}
              position="relative"
              display="flex"
              alignItems="center"
              gap="10px"
              mb="25px"
              flexDirection={userId === message.userId ? 'row-reverse' : 'row'}
            >
              <img
                src={EmptyAvatarIcon}
                alt=""
                style={{
                  width: '36px',
                }}
              />
              {message.message.length ? (
                <Box
                  style={{
                    borderRadius: '14px',
                    backgroundColor:
                      checkIsServiceUser(message.userId)
                        ? '#ffffff'
                        : '#f5f5f5',
                    border:
                      checkIsServiceUser(message.userId)
                        ? '1px solid #cba977'
                        : '1px solid transparent',
                    lineHeight: '20px',
                  }}
                  p="10px 20px"
                >
                  {!checkIsServiceUser(message.userId) && (
                    <Box
                      fontSize="13px"
                      color="#999999"
                      fontWeight="500"
                      sx={{
                        textAlign: userId === message.userId ? 'right' : 'left',
                      }}
                    >
                      {message.userName}
                    </Box>
                  )}
                  <Box
                    style={{
                      color:
                      message.userId ===
                        '00000000-0000-0000-0000-000000000000' ||
                      message.userType === 'admin'
                        ? '#ff0000'
                        : '#000000',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: message.message
                      .replace(/<|>|'|"/g, '')
                      .replace(/\n/g, '<br />'),
                    }}
                  />
                </Box>
              ) : null}

              <Box color="#696969">
              {moment(message.createAt).format('HH:mm')}
              </Box>
            </Box>

            {message.fileIds && message.fileIds.length ? (
              <Box>
                <Box
                  display="flex"
                  mb="25px"
                  flexDirection={
                    userId === message.userId ? 'row-reverse' : 'row'
                  }
                  gap="10px"
                >
                  <Box>
                    {message.fileIds.map((id, index) => (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap="10px"
                        mb="15px"
                      >
                        <img src={DownloadIcon} alt="" />
                        <a
                          download
                          href={
                            process.env.REACT_APP_HTTP_API_URL +
                            '/api/v1/file/' +
                            id
                          }
                          target={'_blank'}
                          rel="noreferrer"
                          style={{
                            textDecoration: 'none',
                            color: '#696969',
                          }}
                        >
                          {id}
                        </a>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : null}
          </MessageContainer>
        ))}
      </MessagesContainer>

      {actions && actions.length ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gap="10px"
          style={{
            backgroundColor: '#ffffff',
          }}
          p="10px"
        >
          {actions.map((action, index) => (
            <Button
              variant="outlined"
              onClick={(_) => onActionClick && onActionClick(index)}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      ) : null}
    </Box>
  );
};

const MessageContainer = styled(Box)`
  background-color: #ffffff;
  transition: 100ms ease all;
  padding: 10px 30px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const MessagesContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflowY: 'auto',
  height: '550px',
  [theme.breakpoints.down("lg")]: {
    height: '413px',
  },
  [theme.breakpoints.down("md")]: {
    height: '335px',
  }
}));

export { ChatMessages };
