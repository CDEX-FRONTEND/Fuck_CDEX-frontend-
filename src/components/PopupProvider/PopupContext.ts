import { Context, createContext } from 'react';

export interface PopupContextProviderProps {
  popup: any;
  setPopup: Function;
}

const PopupContext: Context<PopupContextProviderProps> =
  createContext<PopupContextProviderProps>({
    popup: null,
    setPopup: () => {},
  });

export default PopupContext;
