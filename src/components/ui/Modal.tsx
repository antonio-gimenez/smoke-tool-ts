import { useContext, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ModalContext } from "../../contexts/ModalContext";
import useKey from "../../hooks/useKey";
import useScrollLock from "../../hooks/useScrollLock";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { generateUUID } from "../../utils/utils";
import useScrollState from "../../hooks/useScrollState";
interface ModalProps {
  children: React.ReactNode;
  id?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  closeKey?: string;
  open?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  trigger?: React.ReactNode;
}


const Modal = ({
  children,
  id = generateUUID(),
  closeOnOverlayClick = true,
  closeOnEscape = true,
  closeKey = "Escape",
  open = false,
  header,
  footer,
  trigger,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(document.createElement("div"));
  const portalRef = useRef<HTMLDivElement>(document.createElement("div"));
  const { modals, closeModal } = useContext(ModalContext);
  const isOpen = open || modals[id];

  const [isBodyScrolled] = useScrollState({
    initialState: false,
    axis: "y",
    offset: 20,
  });

  useEffect(() => {
    modalRef.current = document.createElement("div");
    // portalRef.current = document.createElement("div");
  }, []);

  useOnClickOutside({
    ref: modalRef,
    handler: closeOnOverlayClick ? () => closeModal(id) : () => { },
  });

  useKey({
    key: closeKey,
    handler: closeOnEscape ? () => closeModal(id) : () => { },
  });

  useScrollLock(document, isOpen);

  const modalHeader = header ? (
    <div className={`modal-header ${isBodyScrolled ? 'glass' : ''} `}>
      {header}
      <ModalCloseButton id={id} />
    </div>
  ) : (
    <ModalCloseButton id={id} />
  );

  const modalFooter = footer ? (
    <div className="modal-footer">{footer}</div>
  ) : null;

  const modalWindow = (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef} id={id}>
        {modalHeader}
        <div className="modal-content">{children}</div>
        {modalFooter}
      </div>
    </div>
  );

  return (
    <>
      {trigger}
      <div ref={portalRef}>
        {isOpen && createPortal(modalWindow, portalRef.current)}
      </div>
    </>
  );
};

const ModalCloseButton = ({ id }: { id: string }) => {
  const { modals, closeModal } = useContext(ModalContext);
  const isForcedOpen = modals[id];

  return isForcedOpen ? (
    <div className="modal-close-button">
      <button onClick={() => closeModal(id)} className="button">
        <CloseIcon />
      </button>
    </div>
  ) : null;
};

const ModalTrigger = ({ id, children }: { id: string, children: React.ReactNode }) => {
  const { openModal } = useContext(ModalContext);
  return (
    <span onClick={() => openModal(id)}>
      {children}
    </span>
  );
};

export { Modal, ModalTrigger };
