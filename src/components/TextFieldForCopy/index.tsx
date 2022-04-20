import { withStyles } from '@material-ui/core';
import { Box, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import CopyIcon from '../../icons/CopyIcon.svg';
/**
 * custom TextField
 */
const CustomTextField = withStyles((theme) => ({

  root: {
    "& .MuiInputBase-root": {
      backgroundColor: '#F5F5F5',
      borderRadius: '16px',
      color: "black",
      padding: '14px 20px 14px 16px',
    },
    "& fieldset.MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .Mui-disabled": {
      '-webkit-text-fill-color': "black !important",
    },
  },

}))(TextField);

interface TextFieldForCopyProps {
  value: string | number | any;
  onClick: () => void;
}


const TextFieldForCopy = ({ value, onClick }: TextFieldForCopyProps) => {

  const [tooltipOpened, setTooltipOpened] = useState(false);
  
  useEffect(() => {
    tooltipOpened && setTimeout(() => setTooltipOpened(false), 1500);
  }, [tooltipOpened]);


  return (
    <CustomTextField
      variant="outlined"
      multiline
      fullWidth
      value={value || 'Cсылка отсутствует'}
      onClick={() => {
        onClick ();
        setTooltipOpened (true);
      }}
      disabled
      InputProps={{
        endAdornment: (
          <>
            <Tooltip
              open={tooltipOpened}
              title={value ? 'Ссылка скопирована!' : 'Cсылка отсутствует'}
              arrow
              placement="top"
            >
              <Box
                display="flex"
                style={{
                  cursor: 'pointer',
                  marginLeft: '14px'
                }}
              >
                <img src={CopyIcon} alt="" />
              </Box>
            </Tooltip>
          </>
        )
      }}
    />
  )
}


export default TextFieldForCopy;
