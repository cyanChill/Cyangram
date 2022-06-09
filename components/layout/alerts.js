import { GrFormClose } from "react-icons/gr";

import global from "../../global";
import classes from "./alerts.module.css";

const Alerts = () => {
  return (
    <div className={classes.alertsWrapper}>
      {global.alerts.state.map((alert) => (
        <div
          key={alert.id}
          className={`${classes.alert} ${classes[alert.type]}`}
        >
          <div>
            {alert.type !== global.alerts.types.default && (
              <>
                <span className={classes.alertType}>{alert.type}:</span>{" "}
              </>
            )}
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
