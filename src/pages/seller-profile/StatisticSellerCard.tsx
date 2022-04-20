import { Box, useTheme } from "@mui/material";
import DepositIcon from './../../icons/DepositIcon.svg';
import SuccessfulTradesIcon from './../../icons/SuccessfulTradesIcon.svg';
import AverageTransferTimeIcon from './../../icons/AverageTransferTimeIcon.svg';


interface StatisticSellerCardProps {
  label: string,
  value: string | number
}
const StatisticSellerCard = ({ label, value }: StatisticSellerCardProps) => {

  const theme = useTheme();

  const getImgForSellerInfoPanelItem = (label: string) => {
    switch (label) {
      case 'Страховой депозит':
        return DepositIcon;
      case 'Успешные сделки':
        return SuccessfulTradesIcon;
      case 'Среднее время перевода':
        return AverageTransferTimeIcon;
      default:
        break;
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      width: {
        sm: '100%',
        md: '305px'
      },
      flexDirection: 'row',
      alignItems: 'center',
      padding: '8px',
      height: '68px',
      borderRadius: '20px',
      backgroundColor: '#F1EAE3',
      marginRight: '24px',
    }}>
      <Box mr='8px'>
        <img alt="" src={getImgForSellerInfoPanelItem(label)} />{' '}
      </Box>
      <Box ml='10px'>
        <Box color={theme.palette.secondary.dark} mb="4px" fontSize='14px'>
          {label}
        </Box>
        <Box fontSize='15px'>
          <b>{value} </b>
        </Box>
      </Box>
    </Box>
  );
};

export default StatisticSellerCard;