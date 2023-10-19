import { FC } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { Modal as AntModal, ModalProps } from "antd";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  weight: ["200", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const Modal: FC<ModalProps> = ({
  children,
  footer = null,
  width = 700,
  ...rest
}) => {
  return (
    <AntModal
      centered
      width={width}
      footer={footer}
      closeIcon={<VscChromeClose className="text-grey-8 h-6 w-6 text-lg" />}
      {...rest}
    >
      <div className={montserrat.className}>{children}</div>
    </AntModal>
  );
};

export default Modal;
