import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ModalContext } from "../../contexts/ModalContext";
import useKeyPress from "../../hooks/use-key-press";
import useLockBodyScroll from "../../hooks/use-lock-body-scroll";
import useOnClickOutside from "../../hooks/use-on-click-outside";
import { generateUUID } from "../../utils/utils";

interface ModalProps {
  children: React.ReactNode;
  id?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  closeKey?: string;
  open?: boolean;
}

interface ModalHeaderProps {
  children: React.ReactNode;
}

interface ModalContentProps {
  children: React.ReactNode;
}

interface ModalTriggerProps {
  id: string;
  children: React.ReactNode;
}

interface ModalCloseButtonProps {
  id: string;
}



const Modal = ({
  children,
  id = generateUUID(),
  closeOnOverlayClick = true,
  closeOnEscape = true,
  closeKey = "Escape",
  open = false,
}: ModalProps) => {
  const modalRef = useRef(document.createElement("div"));
  const portalRef = useRef(document.createElement("div"));
  const { modals, closeModal } = useContext(ModalContext);
  const isOpen = open || modals[id];

  useOnClickOutside({
    ref: modalRef,
    handler: closeOnOverlayClick ? () => closeModal(id) : () => { },
  });
  useKeyPress({ key: closeKey, handler: closeOnEscape ? () => closeModal(id) : () => { } });
  useLockBodyScroll({ lock: isOpen });

  const modalWindow = (
    <div className="modal-wrapper">
      <div className="modal" ref={modalRef} id={id}>
        <ModalCloseButton id={id} />
        {children}
      </div>
    </div>
  );

  return <div ref={portalRef}>{isOpen && createPortal(modalWindow, portalRef.current)}</div>;
};

const ModalCloseButton = ({ id }: ModalCloseButtonProps) => {
  const { closeModal } = useContext(ModalContext);
  return (
    <button onClick={() => closeModal(id)} className="modal-close-button">
      <CloseIcon className="icon-24" />
    </button>
  );
};

const ModalContent = ({ children, ...props }: ModalContentProps) => {
  return <div className="modal-content">{children}</div>;
};

const ModalTrigger = ({ id, children, ...props }: ModalTriggerProps) => {
  const { openModal } = useContext(ModalContext);
  return <button onClick={() => openModal(id)}>{children}</button>;
};

const ModalHeader = ({ children, ...props }: ModalHeaderProps) => {
  return <div className="modal-header">{children}</div>;
};

export { Modal, ModalContent, ModalTrigger, ModalHeader };
