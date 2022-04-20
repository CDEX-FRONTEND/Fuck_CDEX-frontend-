import { useContext } from 'react';
import PopupContext from '../components/PopupProvider/PopupContext';

const usePopup = () => useContext(PopupContext);

export default usePopup;
