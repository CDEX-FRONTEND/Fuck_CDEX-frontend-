import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '.';
import { systemMessageId } from '../constants/systemMessage';
import { chatService } from '../services/api/chat';

export type ChatMessageType = {
  id: string;
  message: string;
  type: 'text' | 'file';
  roomId: string;
  createAt?: string;
  userId: string;
  userName: string;
  userType: string;
  fileIds: string[];
};

type ChatSliceInitialStateType = {
  messages: ChatMessageType[];
  unreadMessagesCount: number | null;
};

const initialState: ChatSliceInitialStateType = {
  messages: [],
  unreadMessagesCount: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, { payload }) {
      state.messages = payload.reverse();
    },
    addMessage(state, { payload }) {
      state.messages.push(payload);
    },
    setUnreadMessagesCount(state, { payload }) {
      state.unreadMessagesCount = payload;
    },
  },
});

export const { setMessages, addMessage, setUnreadMessagesCount } = chatSlice.actions;

export const getChatMessages = createAsyncThunk(
  'chat/getMessages', async ({ id, currentUserId, isReadAllMessages }:
    { id: string; currentUserId?: string, isReadAllMessages?: boolean }, { dispatch }) => {
  try {
    const response = await chatService.getMessages({
      id,
      page: 1,
      take: 50,
    });

    dispatch(setMessages(response.data.data));

    if (currentUserId && isReadAllMessages) {
      let chatReadMessagesIds: Array<Promise<any>> = [];
      response.data?.data?.forEach((message: any) => {
        if (((message.id !== currentUserId) || (message.id === systemMessageId)) && !message.isReaded) {
          chatReadMessagesIds.push(chatService.setMessageRead(message.id))
        }
      })

      dispatch(setMessagesRead(chatReadMessagesIds));
    }
  }
  catch (err) { }
}
);

export const getUnreadMessagesCount = createAsyncThunk(
  'chat/getUnreadMessagesCount', async (_, { dispatch }) => {
    try {
      const response = await chatService.getUnreadMessagesCount();
      dispatch(setUnreadMessagesCount(response.data));
    } catch (err) { }
  }
);

export const setMessagesRead = createAsyncThunk(
  'chat/getUnreadMessagesCount', async (readMessagesIds: Array<Promise<any>>, { dispatch }) => {
    try {
      Promise.all(
        readMessagesIds
      ).then(values => {
        dispatch(getUnreadMessagesCount());
      });
    } catch (err) { }
    finally { }
  }
);

export const selectMessages = (state: RootState) => state.chat.messages;
export const selectUnreadMessagesCount = (state: RootState) => state.chat.unreadMessagesCount;

export default chatSlice.reducer;
