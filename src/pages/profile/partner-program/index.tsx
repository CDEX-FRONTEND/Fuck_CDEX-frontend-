
import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import TabsSwitcher from "../../../components/TabsSwitcher";
import PartnerLink from "./partner-link";
import Referral from "./referral";
import Statistic from "./statistic";


const PartnerProgram = () => {
  const [currentTab, setCurrentTabTab] = useState(0);
  const tadsItems = ['Реферальная ссылка', 'Статистика', 'Рефералы'];

  const getTabComponent = (tab: number) => {
    switch (tab) {
      case 0: return <PartnerLink />;
      case 1: return <Statistic />;
      case 2: return <Referral />;
      default: return <PartnerLink />;
    }
  };

  return (
    <Box sx={{
      paddingTop: {
        sm: '24px',
      }
    }}>
      <TabsSwitcher items={tadsItems} onChanged={(index) => setCurrentTabTab(index)}
        defaultValue={currentTab} />
      <div style={{marginTop: '32px'}}>
        {getTabComponent(currentTab)}
      </div>
    </Box>
  )

}
export default PartnerProgram;
