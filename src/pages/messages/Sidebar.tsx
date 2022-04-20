import { Box, styled } from '@mui/material';
import { useCallback } from 'react';
import { AdvertisementChatType, UserType } from '../../store/otcSlice';
import EmptyAvatarIcon from '../../icons/EmptyAvatarIcon.svg';
import VerifiedIcon from '../../icons/VerifiedIconGold.svg';

interface SidebarProps {
  chats: AdvertisementChatType[];
  onClick?: Function;
  roomId?: string;
  userId?: string;
  readMessagesChatsIds?: Array<string>;
}

const Sidebar = ({
  chats,
  onClick,
  roomId,
  userId,
  readMessagesChatsIds,
}: SidebarProps) => {
  const findUser = useCallback((users: UserType[]) => {
    const result = users.filter((user) => user.userId !== userId);
    return result.length ? result[0] : null;
  }, []);

  return (
    <Box
      maxHeight="650px"
      style={{
        overflowY: 'scroll',
      }}
    >
      {chats && chats.length
        ? [...chats]
            .sort((a, b) =>
              a.room.countUnreadedMessages <
              b.room.countUnreadedMessages
                ? 1
                : -1
            )
            .sort((a, b) =>
              new Date(a.room.createAt).getTime() <
              new Date(b.room.createAt).getTime()
                ? 1
                : -1
            )
            .map((chat, index) => {
              const user = findUser(chat.users);

              return (
                <Row
                  onClick={() => {
                    if (onClick) {
                      onClick(chat);
                    }
                  }}
                  style={{
                    backgroundColor:
                      roomId && chat.room.id === roomId ? '#f6f6f6' : '#ffffff',
                  }}
                >
                  <img src={EmptyAvatarIcon} alt="" />

                  <Box>
                    <Box>
                      <Box fontWeight="bold" color="#464646">
                        {user ? user.name : 'deleted'}
                      </Box>

                      {user && user.userIsVerified && (
                        <img src={VerifiedIcon} alt="" />
                      )}
                    </Box>

                    <Box mt="10px" fontSize="12px" color="#999999">
                      {chat.room.id}
                    </Box>
                  </Box>
                  <Box
                    position="absolute"
                    top="0"
                    bottom="0"
                    right="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {chat.room.countUnreadedMessages > 0 ? (
                      <Badge>{chat.room.countUnreadedMessages}</Badge>
                    ) : null}
                  </Box>
                </Row>
              );
            })
        : null}
    </Box>
  );
};

const Row = styled(Box)`
  position: relative;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 40px 20px 10px;
  cursor: pointer;
  transition: 300ms ease all;
`;

const Badge = styled(Box)`
  background-color: #FF1616;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 36px;
  font-size: 12px;
  font-weight: bold;
`

export { Sidebar };
