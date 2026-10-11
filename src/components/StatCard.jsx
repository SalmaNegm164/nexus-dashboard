
import {
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function StatCard({ stat, chartPeriod, setActivePage }) {
  const Icon = stat.icon;

  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <div className={`stat-icon ${stat.color}`}>
          <Icon size={21} />
        </div>

        <button
          type="button"
          className="icon-button card-menu"
          aria-label={`${stat.title} options`}
          onClick={() => setActivePage("Analytics")}
        >
          ···
        </button>
      </div>

      <p className="stat-title">{stat.title}</p>
      <div className="stat-value">{stat.value}</div>

      <div className="stat-footer">
        <span
          className={`change-badge ${
            stat.positive ? "positive" : "negative"
          }`}
        >
          {stat.positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}

          {stat.change}
        </span>

        <span className="comparison">
          vs. previous{" "}
          {chartPeriod === "Daily"
            ? "day"
            : chartPeriod === "Weekly"
              ? "week"
              : "month"}
        </span>
      </div>
    </article>
  );
}

export default StatCard;
