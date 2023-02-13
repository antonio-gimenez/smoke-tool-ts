import { createContext, useContext, useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import useDeviceType from "../hooks/use-device-type";
import useKeyPress from "../hooks/use-key-press";
import { generateUUID, groupBy } from "../utils/utils";

export const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  useKeyPress({
    key: "Escape",
    handler: () => {
      if (alerts.length > 0) {
        setAlerts((prevAlerts) => prevAlerts.slice(1));
      }
    },
  });
  const [animationDelay, setAnimationDelay] = useState(200);
  const addAlert = ({
    id = generateUUID(),
    message,
    type = "base",
    duration = 0,
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
                animation={alert.animation}
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

  function positionateOnMobile() {
    if (deviceType === "mobile" || deviceType === "tablet") {
      return "mobile";
    }
    return position;
  }

  function alertMobilePosition() {
    if (deviceType === "mobile" || deviceType === "tablet") {
      return "alert-mobile";
    }
    return "alert";
  }

  if (!isAlertVisible(id) || !children) return null;
  return (
    <div id={id} className={`${alertMobilePosition()} alert-${type}`} {...props} role="alert">
      <div className="alert-section">
        <div className="alert-description">
          {/* <span>device-debug: {deviceType}</span> */}
          {title ? <div className="alert-title">{title}</div> : null}
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
