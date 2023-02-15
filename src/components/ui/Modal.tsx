import { useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ModalContext } from "../../contexts/ModalContext";
import useKeyPress from "../../hooks/use-key-press";
import useLockScroll from "../../hooks/use-scroll-lock";
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
  useLockScroll(document, isOpen,);

  const modalWindow = (
    <div className="backdrop">
      <div className="modal" ref={modalRef} id={id}>
        <ModalCloseButton id={id} />
        {children}
      </div>
    </div>
  );

  return <div ref={portalRef}>{isOpen && createPortal(modalWindow, portalRef.current)}</div>;
};

const ModalCloseButton = ({ id }: { id: string }) => {
  const { closeModal } = useContext(ModalContext);
  return (
    <div className="modal-close-button">

      <button onClick={() => closeModal(id)} className="button">
        <CloseIcon className="icon-24" />
      </button>
    </div>
  );
};

const ModalContent = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="modal-content">{children}</div>;
};

const ModalTrigger = ({ id, children, ...props }: { id: string, children: React.ReactNode }) => {
  const { openModal } = useContext(ModalContext);
  return <button className="button" type="button" onClick={() => openModal(id)}>{children}</button>;
};

const ModalHeader = ({ children, ...props }: { children: React.ReactNode }) => {
  return <div className="modal-header">{children}</div>;
};

export { Modal, ModalContent, ModalTrigger, ModalHeader };
