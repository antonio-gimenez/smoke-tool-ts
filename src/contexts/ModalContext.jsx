import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState({});

  function openModal(id) {
    if (!id) return;
    setModals((prevModals) => ({
      ...prevModals,
      [id]: true,
    }));
  }

  function closeModal(id) {
    if (!id || !modals[id]) return;
    setModals((prevModals) => {
      const { [id]: _, ...rest } = prevModals;
      return rest;
    });
  }

  return <ModalContext.Provider value={{ modals, openModal, closeModal }}>{children}</ModalContext.Provider>;
}
