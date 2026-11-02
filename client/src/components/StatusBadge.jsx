function StatusBadge({ status = "unknown" }) {
  const normalizedStatus = String(status).trim().toLowerCase();

  const badgeVariant = {
    scheduled: "neutral",
    boarding: "primary",
    delayed: "warning",
    departed: "positive",
    cancelled: "negative",
    open: "negative",
    investigating: "warning",
    resolved: "positive",
    closed: "neutral"
  }[normalizedStatus] || "neutral";

  const label = normalizedStatus
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <span className={`status-badge status-badge--${badgeVariant}`}>
      {label}
    </span>
  );
}

export default StatusBadge;
