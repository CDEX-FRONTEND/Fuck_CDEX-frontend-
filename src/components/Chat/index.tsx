import { Box } from '@mui/material';
import { ChatInput } from '../ChatInput';
import { ChatMessages } from '../ChatMessages';
import { ChatMessageType } from '../../store/chatSlice';

interface ChatProps<T> {
  messages: T[];
  userId: string;
  onSubmit: (text: string) => void;
  actions?: TChatAction[];
  onActionClick?: (index: number) => void;
  inputDisabled?: boolean;
  onFileUpload?: Function;
  inputPlaceholder?: string;
  attachments?: string[];
  onDeleteAttachment?: (id: string) => void;
  fullHeight?: boolean;
  timer?: number
}

export type TChatAction = {
  label: string;
};

const Chat = <T extends ChatMessageType>({
  messages,
  userId,
  onSubmit,
  actions,
  onActionClick,
  inputDisabled,
  onFileUpload,
  inputPlaceholder,
  attachments,
  onDeleteAttachment,
  fullHeight = false,
  timer,
}: ChatProps<T>) => {
  return (
    <Box position="relative" height="100%">
      <ChatMessages
        messages={messages}
        userId={userId}
        actions={actions}
        onActionClick={onActionClick}
        fullHeight={fullHeight}
      />
      <ChatInput
        onSubmit={onSubmit}
        onFileUpload={onFileUpload}
        inputDisabled={inputDisabled}
        placeholder={inputPlaceholder}
        attachments={attachments}
        onDeleteAttachment={onDeleteAttachment}
        timer={timer}
      />
    </Box>
  );
};

export { Chat };
