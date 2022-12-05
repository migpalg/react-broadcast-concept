import classes from "./status-badge.module.css";

export function StatusBadge({ status }) {
  return (
    <div className={classes.badge}>
      <p className={classes["badge-text"]}>{status || "No status"}</p>
    </div>
  );
}
