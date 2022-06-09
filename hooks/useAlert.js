import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

const types = {
  default: "default",
  error: "error",
  success: "success",
  warning: "warning",
};

const useAlert = () => {
  const [alerts, setAlerts] = useState([]);

  const actions = useMemo(() => {
    return {
      addAlert: (newAlert) => {
        const alertId = uuidv4();
        setAlerts((prev) => [...prev, { ...newAlert, id: alertId }]);

        setTimeout(() => {
          setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
        }, 3000);
      },
      removeAlert: (alertId) => {
        setAlerts(alerts.filter((alert) => alert.id !== alertId));
      },
    };
  }, [alerts]);

  return { state: alerts, actions, types };
};

export default useAlert;
