import { io, Socket } from 'socket.io-client';

const createChat = (roomId: string, token: string): Socket => {
  return io(
    process.env.REACT_APP_HTTP_API_URL
      ? process.env.REACT_APP_HTTP_API_URL
      : 'http://localhost:3001',
    {
      transports: ['websocket'],
      query: {
        roomId,
      },
      auth: {
        token,
      },
    }
  );
};

export default createChat;
