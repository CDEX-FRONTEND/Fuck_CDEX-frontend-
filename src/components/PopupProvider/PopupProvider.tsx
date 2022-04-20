import React, { useState } from 'react';
import PopupContext from './PopupContext';

interface PopupProviderProps {
  children: any;
}

const PopupProvider = ({ children }: PopupProviderProps) => {
  const [popup, setPopup] = useState();
  return (
    <PopupContext.Provider
      value={{
        popup,
        setPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export default PopupProvider;
