import { Box, styled, Typography } from "@mui/material";
import { PaymentMethodType } from "../../store/otcSlice";


interface AdvertisementInfoProps {
  advertisement: any,
  mainCurrencyId: string,
  paidCurrencyId: string,
}

const AdvertisementInfo = ({ advertisement, mainCurrencyId, paidCurrencyId }: AdvertisementInfoProps) => {

  return (
    // <Box display="flex" minHeight="500px">
    <>
      <Typography fontSize='16px' fontWeight='600' mb='20px'>
        {`${advertisement.side === 'ask' ? 'Продать' : 'Купить'
          } ${mainCurrencyId} за ${paidCurrencyId}`}
      </Typography>
      <AdvInfoItem>
        <AdvInfoItemTitle>Ставка</AdvInfoItemTitle>
        {advertisement.factor * 100}% (вы оплачиваете)
      </AdvInfoItem>
      <AdvInfoItem>
        <AdvInfoItemTitle>Метод оплаты</AdvInfoItemTitle>
        {advertisement.paymentMethods.length > 0 ? advertisement.paymentMethods
          .map((paymentMethod: PaymentMethodType) => paymentMethod.name)
          .join(', ') : 'Любой'}
      </AdvInfoItem>

      <AdvInfoItem>
        <AdvInfoItemTitle>Количество</AdvInfoItemTitle>
        {advertisement.volume} - {advertisement.volumeMax}
      </AdvInfoItem>

      <AdvInfoItem>
        <AdvInfoItemTitle>Условия сделки</AdvInfoItemTitle>
        {advertisement.conditionsTrade || '-'}
      </AdvInfoItem>

      <Box color="#ff0000" mb="10px" textAlign="justify">
        Системные сообщения об открытии сделки выводятся красным
        цветом, остерегайтесь мошенников! Реквизиты для оплаты
        получайте только в чате! Реквизиты вне чата передают только
        мошенники!
      </Box>
      <Divider />
    </>
    // </Box>
  )
}

export default AdvertisementInfo;



const AdvInfoItem = styled(Box)`
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 21px;
      `;

const AdvInfoItemTitle = styled(Box)`
      color: ${(props) => props.theme.palette.secondary.dark};
      padding-bottom: 8px;
      `;

const Divider = styled(Box)`
  border-bottom: 1px solid #dce5e9;
`;