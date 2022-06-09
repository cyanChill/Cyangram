import { useSession } from "next-auth/react";
import { GrFormClose } from "react-icons/gr";

import global from "../../global";
import classes from "./alerts.module.css";

const Alerts = () => {
  const { status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className={classes.alertsWrapper}>
      {global.alerts.state.map((alert) => (
        <div
          key={alert.id}
          className={`${classes.alert} ${classes[alert.type]}`}
        >
          <div>
            <span className={classes.alertType}>{alert.type}:</span>{" "}
            {alert.content}
          </div>
          <div className={classes.exitIconContainer}>
            <GrFormClose
              onClick={() => global.alerts.actions.removeAlert(alert.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Alerts;
