import React, { createContext, useContext, useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import { generateUUID } from "../utils/utils";

export const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = ({ id = generateUUID(), message, type = "base", duration = 0, title = null }) => {
    if (!title) {
      switch (type) {
        case "success":
          title = "Operation Completed Successfully";
          break;
        case "info":
          title = "Information";
          break;
        case "error":
          title = "Something went wrong";
          break;
        case "warning":
          title = "Attention Required";
          break;
        default:
          title = "Notification";
      }
    }

    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type, duration, title }]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const isAlertVisible = (id) => {
    return alerts.some((alert) => alert.id === id);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, isAlertVisible }}>
      {children}
      <div className="alert-container">
        {alerts?.map((alert, index) => (
          <Alert key={alert.id} id={alert.id} title={alert.title} type={alert.type} duration={alert.duration}>
            {alert.message}
          </Alert>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function Alert({ id, children, duration, title, type, ...props }) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const { removeAlert, isAlertVisible } = useContext(AlertContext);
  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prevRemainingTime) => {
          if (prevRemainingTime <= 0) {
            removeAlert(id);
            clearInterval(interval);
          }
          return prevRemainingTime - 1000;
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [duration]);

  if (!isAlertVisible(id) || !children) return null;
  return (
    <div id={id} className={`alert alert-${type}`} {...props} role="alert">
      <div className="alert-section">
        <div className="alert-description">
          <div className="alert-t">{title ? <div className="alert-title">{title}</div> : null}</div>
          <div className="alert-message">{children}</div>
        </div>
        {duration > 0 ? (
          <p className="alert-remaining-time"> {remainingTime / 1000}s</p>
        ) : (
          <button className="alert-dismiss" onClick={() => removeAlert(id)}>
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}
