import React, { useRef, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useKeyPress from "../../hooks/use-key-press";
import useOnClickOutside from "../../hooks/use-on-click-outside";
import { ModalContext } from "../../contexts/ModalContext";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import useLockBodyScroll from "../../hooks/use-lock-body-scroll";

const Modal = ({
  children,
  id = undefined,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  closeKey = "Escape",
  open = false,
}) => {
  const modalRef = useRef(document.createElement("div"));
  const portalRef = useRef(document.createElement("div"));
  const { modals, closeModal } = useContext(ModalContext);
  const isOpen = open || modals[id];

  useOnClickOutside({
    ref: modalRef,
    handler: closeOnOverlayClick ? () => closeModal(id) : () => {},
  });
  useKeyPress({ key: closeKey, handler: closeOnEscape ? () => closeModal(id) : () => {} });
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

const ModalCloseButton = ({ id }) => {
  const { closeModal } = useContext(ModalContext);
  return (
    <button onClick={() => closeModal(id)} className="modal-close-button">
      <CloseIcon className="icon-24" />
    </button>
  );
};

const ModalContent = ({ children, ...props }) => {
  return <div className="modal-content">{children}</div>;
};

const ModalTrigger = ({ id, children, ...props }) => {
  const { openModal } = useContext(ModalContext);
  return <button onClick={() => openModal(id)}>{children}</button>;
};

const ModalHeader = ({ children, ...props }) => {
  return <div className="modal-header">{children}</div>;
};

export { Modal, ModalContent, ModalTrigger, ModalHeader };
