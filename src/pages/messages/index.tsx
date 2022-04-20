import React, { createRef, useCallback, useEffect, useState } from 'react';
import DealArrowRightIcon from '../../icons/DealArrowRightIcon.svg';
import useAppDispatch from '../../hooks/useAppDispatch';
import {
  AdvertisementChatType,
  getAdvertisementChatList,
} from '../../store/otcSlice';
import useAppSelector from '../../hooks/useAppSelector';
import {
  addMessage,
  getChatMessages,
  selectMessages,
  setMessages,
} from '../../store/chatSlice';
import { selectUser } from '../../store/userSlice';
import { generatePath, useHistory } from 'react-router';
import socketManager from '../../services/socketManager';
import { uploadFileService } from '../../services/api/file';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress, styled, Typography } from '@mui/material';
import { Chat } from '../../components/Chat';
import createChat from '../../lib/createChat';
import { Sidebar } from './Sidebar';

const Messages = () => {
  const { token } = useAuth();
  const chats = useAppSelector((state) => state.otc.advertisementChatList);
  const [roomId, setRoomId] = useState<string | undefined>();
  const [connected, setConnected] = useState<boolean>(false);
  const messages = useAppSelector(selectMessages);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const chatContainerRef = createRef<HTMLDivElement>();
  const history = useHistory();
  const [attachments, setAttachments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [isUnreadMessagesInChat, setIsUnreadMessagesInChat] =
    useState<boolean>(false);
  const [readMessagesChatsIds, setReadMessagesChatsIds] = useState<
    Array<string>
  >([]);

  useEffect(() => {
    dispatch(getAdvertisementChatList({ page: 1, take: 10 }));
    const interval = setInterval(() => {
      dispatch(getAdvertisementChatList({ page: 1, take: 10 }));
    }, 10000);
    return () => {
      setReadMessagesChatsIds([]);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    dispatch(setMessages([]));
    setConnected(false);
    socketManager.socket?.close();
    socketManager.socket = null;
    if (roomId && token) {
      console.log(`connect to chat`);
      socketManager.socket = createChat(roomId, token);
      socketManager.socket.on(`message-to-${roomId}`, (message) => {
        dispatch(addMessage(message));
        getAdvertisementChatList({
          page: 1,
          take: 10,
        });
      });
      socketManager.socket.on(`connected-to-${roomId}`, (users) => {
        console.log(`connected ${roomId}`);
        setConnected(true);

        dispatch(
          getChatMessages({
            id: roomId,
            currentUserId: user?.id,
            isReadAllMessages: isUnreadMessagesInChat, // нужно ли читать соо
          })
        );
      });
    }

    if (roomId) {
      //чтобы установить у открытого чата unreadMessagesCount в 0
      setReadMessagesChatsIds((readMessagesChatsIds) => [
        ...readMessagesChatsIds,
        roomId,
      ]);
    }
  }, [roomId]);

  useEffect(() => {
    if (messages && messages.length && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onFileUpload = useCallback(
    (
      files: {
        file: File;
        valid: boolean;
      }[]
    ) => {
      if (files.length && !loading) {
        setLoading(true);

        files
          .filter((file) => file.valid)
          .forEach(async (file) => {
            const data = new FormData();
            data.append('file', file.file);
            try {
              const response = await uploadFileService.uploadFile(data);

              console.log(response.data.id);

              setAttachments([response.data.id, ...attachments]);
            } catch (err) {}
          });

        setLoading(false);
      }
    },
    [loading]
  );

  const onDeleteAttachment = useCallback(
    (id: string) => {
      setAttachments(attachments.filter((attachId) => attachId !== id));
    },
    [attachments]
  );

  const onSubmit = useCallback(
    (message: string) => {
      if (connected && roomId) {
        if (attachments.length) {
          socketManager.socket?.emit('message-to-server', {
            message,
            roomId,
            type: 'file',
            jwtToken: token,
            fileIds: attachments,
          });

          setAttachments([]);
        } else {
          socketManager.socket?.emit('message-to-server', {
            message,
            roomId,
            type: 'text',
            jwtToken: token,
          });
        }
      }
    },
    [connected, roomId]
  );

  const room = chats.find((chat) => chat.room.id === roomId);

  const checkUnreadMessagesInChat = (chat: AdvertisementChatType) => {
    console.log(chat.room.countUnreadedMessages > 0);
    if (chat.room.countUnreadedMessages > 0) {
      setIsUnreadMessagesInChat(true);
    } else {
      if (isUnreadMessagesInChat) setIsUnreadMessagesInChat(false);
    }
  };

  return (
    <>
      {chats.length ? (
        <Box display="flex">
          <Sidebar
            chats={chats}
            onClick={(chat: AdvertisementChatType) => {
              checkUnreadMessagesInChat(chat);
              setRoomId(roomId !== chat.room.id ? chat.room.id : undefined);
            }}
            roomId={roomId}
            userId={user?.id}
            readMessagesChatsIds={readMessagesChatsIds}
          />

          <Box flex="1" position="relative">
            {roomId ? (
              <>
                {room?.tradeId && (
                  <Box
                    display="flex"
                    p="20px"
                    gap="20px"
                    color="#666666"
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      history.push(
                        generatePath('/trade/:id', {
                          id: room.tradeId,
                        })
                      )
                    }
                  >
                    Активная сделка #{room?.tradeIdNumber}
                    <img src={DealArrowRightIcon} alt="" />
                  </Box>
                )}

                <ChatContainer>
                  <Chat
                    messages={messages}
                    userId={user?.id!!}
                    onSubmit={onSubmit}
                    inputPlaceholder="Введите сообщение"
                    onFileUpload={onFileUpload}
                    onDeleteAttachment={onDeleteAttachment}
                    attachments={attachments}
                  />
                </ChatContainer>
              </>
            ) : (
              <Box
                position="absolute"
                top="0"
                right="0"
                bottom="0"
                left="0"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="h5" color="#999999">
                  Выберите чат
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          p="40px"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

const ChatContainer = styled(Box)`
  flex: 1;
  border-left: 1px solid #dce5e9;
  height: 100%;
`;

export default Messages;
