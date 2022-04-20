import { InputButton } from '@dropzone-ui/react';
import { Box, styled } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import ClipIcon from '../../icons/ClipIcon.svg';
//import DownloadIcon from '../../icons/DownloadIcon.svg';
//import CloseIcon from '@mui/icons-material/Close';
import Send2Icon from '../../icons/Send2Icon.svg';

interface ChatInputProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
  onFileUpload?: Function;
  inputDisabled?: boolean;
  attachments?: string[];
  onDeleteAttachment?: (id: string) => void;
  timer?: number;
}

const ChatInput = ({
  onSubmit,
  placeholder,
  onFileUpload,
  inputDisabled,
  attachments,
  onDeleteAttachment,
  timer,
}: ChatInputProps) => {
  const [text, setText] = useState<string>("")

  const doSubmit = () => {
    if (text.length || (attachments && attachments.length !== 0)) {
      onSubmit(text);
      // очищаем текстовое поле
      setText("")
    }
  };

  return (
    <Box
      height="100px"
      position="absolute"
      bottom="0"
      left="0"
      right="0"
      style={{
        backgroundColor: '#ffffff',
      }}
    >
      {timer ? <Timer>Автоомена сделки произойдёт через <b>{moment.utc(moment.duration(timer, "minutes").asMilliseconds()).format("HH:mm")}</b></Timer> : null}
      <InputContainer>
        <Box position="relative">
          {attachments && attachments.length ? (
            <Badge>{attachments.length}</Badge>
          ) : null}
          <InputButton
            accept="image/jpg, image/png, image/jpeg, application/pdf"
            onChange={onFileUpload}
            variant="text"
            multiple={true}
            label=""
            style={{
              background: `url(${ClipIcon}) no-repeat center center`,
              width: '36px',
              height: '36px',
              padding: '0',
            }}
            disabled={inputDisabled || (attachments && attachments.length >= 5)}
          />
        </Box>

        <StyledTextField
          onKeyUp={(event) => {
            if (event.keyCode === 13) {
              doSubmit();
            }
          }}
          style={{
            flex: '1',
          }}
          placeholder={placeholder ? placeholder : 'Введите сообщение'}
          disabled={inputDisabled}
          //ref={inputRef}
          onChange={(event) => {
            setText(event.target.value)
          }}
          value={text}
        />

        <SendButton
          onClick={() => {
            doSubmit();
          }}
        >
          <img src={Send2Icon} alt="" />
        </SendButton>
      </InputContainer>
    </Box>
  );
};

const InputContainer = styled(Box)`
  position: relative;
  border-top: 1px solid #dce5e9;
  padding: 30px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Badge = styled(Box)`
  position: absolute;
  top: -10px;
  right: 0;
  background-color: #ff0000;
  color: #ffffff;
  width: 16px;
  height: 16px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const StyledTextField = styled('input')`
  border-radius: 36px;
  padding: 0 16px;
  border: 1px solid #d9d9d9;
  outline: none;
  line-height: 38px;
`;

const SendButton = styled(Box)`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #bebebe;
  border-radius: 36px;
`;

const Timer = styled(Box)`
  background: rgba(0, 0, 0, 0.6);
  height: 45px;
  line-height: 45px;
  color: #ffffff;
  text-align: center;
  position: absolute;
  top: -45px;
  right: 0;
  left: 0;
  z-index: 1;
`

export { ChatInput };
