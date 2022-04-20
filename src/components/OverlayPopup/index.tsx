import { FC } from "react";
import Overlay from "../Overlay";
import Popup from "../Popup";

interface IOverlayPopupProps {
  children: any;
  onClose: () => void;
  closeable?: boolean;
  title?: string;
  fixedWidth?: boolean;
}

const OverlayPopup: FC<IOverlayPopupProps> = ({
  children,
  onClose,
  closeable = true,
  title,
  fixedWidth = true,
}) => (
  <Overlay onClick={onClose}>
    <Popup
      onClose={onClose}
      closeable={closeable}
      title={title}
      fixedWidth={fixedWidth}
    >
        {children}
    </Popup>
  </Overlay>
);

export { OverlayPopup };
