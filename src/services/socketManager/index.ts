import { Socket } from 'socket.io-client';

interface ISocketManagerInterface {
  socket: Socket | null;
}

const socketManager: ISocketManagerInterface = {
  socket: null,
};

export default socketManager;
