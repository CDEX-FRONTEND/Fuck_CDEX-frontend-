import { Box, Tooltip, Typography } from '@mui/material';
import { FC } from 'react';
import ConfirmationIcon from '../../icons/ConfirmedAccountIcon.svg';
import EmptyAvatarIcon from '../../icons/EmptyAvatarIcon.svg';

interface ISidebarCardProps {
  name?: string;
  verified: boolean | null;
}

const SidebarCard: FC<ISidebarCardProps> = ({ name, verified = false }) => {
  return (
    <Box display="flex" alignItems="center" gap="10px"
      sx={{
        wordBreak: 'break-word'
      }} >
      <img src={EmptyAvatarIcon} alt="avatar" />
      <Typography variant="h5" component="h5">
        {name}
      </Typography>
      {verified && (
        <Tooltip title="Verified" placement="top">
          <Box
            display="inline-block"
            style={{
              cursor: 'pointer',
            }}
          >
            <img src={ConfirmationIcon} alt="" />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

export { SidebarCard };
