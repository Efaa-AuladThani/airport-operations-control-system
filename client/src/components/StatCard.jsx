function StatCard({ title, value, icon, trend, trendType }) {
  const trendClass = trendType === "positive" ? "stat-card__trend--positive" : "stat-card__trend--negative";

  return (
    <article className="stat-card">
      {/* Icon and summary label */}
      <div className="stat-card__header">
        <div className="stat-card__icon-wrapper">{icon}</div>
        <div className="stat-card__summary">
          <p className="stat-card__title">{title}</p>
          <p className="stat-card__value">{value}</p>
        </div>
      </div>

      {/* Optional trend indicator */}
      {trend && (
        <div className={`stat-card__trend ${trendClass}`}>
          <span className="stat-card__trend-text">{trend}</span>
        </div>
      )}
    </article>
  );
}

export default StatCard;
