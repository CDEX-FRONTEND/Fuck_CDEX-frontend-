import React, { useEffect } from "react";
import Switcher from "../../../components/Switch";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import {
  selectSettings,
  getNotificationsSettings,
  NotificationSettingType,
  enableNotificationSetting,
  disableNotificationSetting,
  selectError,
  setError,
  selectIsLoading,
} from "../../../store/notificationsSlice";
import { eventKeys, getEventTypeTitle } from "../../../constants/notifications";
import { ErrorPopup } from "../../../components/ErrorPopup";
import usePopup from "../../../hooks/usePopup";
import { Box } from "@mui/material";
import { NotificationItem, SwitcherItem, SwitcherItemTitle, SwitchersContainer } from "./Notifications.styled";

export default function Notifications() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectIsLoading);
  const { setPopup } = usePopup();

  useEffect(() => {
    dispatch(getNotificationsSettings());
  }, []);

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            setPopup(null);
            dispatch(setError(null));
          }}
          errorMessage={error.message}
        />
      );
    }
  }, [error]);

  const handleChange = (
    checked: boolean,
    eventType: string,
    eventKey: string
  ) => {
    if (loading) {
      return;
    }
    if (checked) {
      dispatch(enableNotificationSetting(eventType, eventKey));
      return;
    }
    dispatch(disableNotificationSetting(eventType, eventKey));
  };

  return (
    <>
      {settings &&
        settings.filter(s => s.eventType !== 'user-operation').map((setting: NotificationSettingType) => (
          <NotificationItem key={setting.eventType}>
            <Box sx={{
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '20px',
              paddingBottom: {
                sm: '16px',
                md: '0px'
              }
            }}>
              {getEventTypeTitle(setting.eventType)}
            </Box>
            <SwitchersContainer>
              <SwitcherItem>
                <SwitcherItemTitle>Почта</SwitcherItemTitle>
                <Switcher
                  checked={setting.email}
                  loading={loading}
                  onChange={(event) =>
                    handleChange(
                      event.target.checked,
                      setting.eventType,
                      eventKeys.email
                    )
                  }
                />
              </SwitcherItem>
              <SwitcherItem>
                <SwitcherItemTitle>Телеграм</SwitcherItemTitle>
                <Switcher
                  checked={setting.telegram}
                  loading={loading}
                  onChange={(event) =>
                    handleChange(
                      event.target.checked,
                      setting.eventType,
                      eventKeys.telegram
                    )
                  }
                />
              </SwitcherItem>
            </SwitchersContainer>
          </NotificationItem>
        ))}
    </>
  );
}




