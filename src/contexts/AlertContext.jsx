import { createContext, useContext, useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import useDeviceType from "../hooks/use-device-type";
import { generateUUID, groupBy } from "../utils/utils";

export const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const addAlert = ({
    id = generateUUID(),
    message,
    type = "base",
    duration = 3000,
    title = null,
    position = "top-right",
  }) => {
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type, duration, title, position }]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const isAlertVisible = (id) => {
    return alerts.some((alert) => alert.id === id);
  };

  const groupedAlerts = groupBy(alerts, "position");

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, isAlertVisible }}>
      {children}
      <div className={`alert-wrapper`}>
        {Object.entries(groupedAlerts).map(([position, alerts]) => (
          <div key={`stack-alerts-on-${position}`} className={`position-${position}`}>
            {alerts.map((alert) => (
              <Alert
                position={position}
                key={alert.id}
                id={alert.id}
                title={alert.title}
                type={alert.type}
                duration={alert.duration}
              >
                {alert.message}
              </Alert>
            ))}
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function Alert({ id, children, duration, title, type, position, ...props }) {
  const [remainingTime, setRemainingTime] = useState(duration);
  const { removeAlert, isAlertVisible } = useContext(AlertContext);
  const deviceType = useDeviceType();
  useEffect(() => {
    if (duration > 0) {
      let interval;
      const startTimer = () => {
        interval = setInterval(() => {
          if (remainingTime <= 0) {
            removeAlert(id);
            clearInterval(interval);
          } else {
            setRemainingTime(remainingTime - 1000);
          }
        }, 1000);
      };
      startTimer();
      return () => {
        clearInterval(interval);
      };
    }
  }, [duration, id, remainingTime, removeAlert]);

  if (!isAlertVisible(id) || !children) return null;
  return (
    <div id={id} className={`alert alert-${type}`} {...props} role="alert">
      <div className="alert-section">
        <div className="alert-description">
          {title ? <div className="alert-title">{title} </div> : null}
          <div className="alert-message">{children}</div>
        </div>
        {!duration && (
          <button className="alert-dismiss" onClick={() => removeAlert(id)}>
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}
