
import {
  ChartNoAxesCombined,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  CalendarDays,
  ChevronDown,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const monthDefinitions = [
  { month: "May", key: "2026-05" },
  { month: "Jun", key: "2026-06" },
  { month: "Jul", key: "2026-07" },
  { month: "Aug", key: "2026-08" },
  { month: "Sep", key: "2026-09" },
  { month: "Oct", key: "2026-10" },
];

const channelData = [
  { name: "Direct", value: 42, color: "#818cf8" },
  { name: "Social", value: 28, color: "#34d399" },
  { name: "Search", value: 19, color: "#fbbf24" },
  { name: "Referral", value: 11, color: "#f472b6" },
];

const tooltipStyle = {
  background: "#111827",
  border: "1px solid #273449",
  borderRadius: "12px",
  color: "#f1f5f9",
  padding: "10px 14px",
};

function formatCurrency(amount) {
  return `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function AnalyticsMetric({ metric }) {
  const Icon = metric.icon;

  return (
    <article className="analytics-metric">
      <div className="analytics-metric-top">
        <div className={`analytics-metric-icon ${metric.color}`}>
          <Icon size={20} />
        </div>

        {metric.change && (
          <span
            className={`analytics-change ${
              metric.positive ? "is-positive" : "is-negative"
            }`}
          >
            {metric.positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {metric.change}
          </span>
        )}
      </div>

      <p className="analytics-metric-title">{metric.title}</p>
      <h3 className="analytics-metric-value">{metric.value}</h3>
      <span className="analytics-metric-note">{metric.note}</span>
    </article>
  );
}

export default function AnalyticsPage({ transactions = [] }) {
  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "Completed"
  );

  const totalRevenue = completedTransactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  const totalCustomers = new Set(
    transactions
      .map((transaction) =>
        transaction.email?.trim().toLowerCase()
      )
      .filter(Boolean)
  ).size;

  const totalOrders = transactions.length;

  const revenueData = monthDefinitions.map(({ month, key }) => {
    const monthlyTransactions = transactions.filter(
      (transaction) => transaction.date?.startsWith(key)
    );

    const monthlyRevenue = monthlyTransactions
      .filter(
        (transaction) => transaction.status === "Completed"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );

    return {
      month,
      revenue: monthlyRevenue,
      orders: monthlyTransactions.length,
    };
  });

  const metrics = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: Wallet,
      color: "blue",
      note: "Completed transactions",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString("en-US"),
      icon: Users,
      color: "purple",
      note: "Unique customer emails",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString("en-US"),
      icon: ShoppingCart,
      color: "orange",
      note: "All recorded transactions",
    },
    {
      title: "Conversion Rate",
      value: "N/A",
      icon: Target,
      color: "green",
      note: "Visitor data required",
    },
  ];

  return (
    <section className="analytics-page">
      <div className="analytics-page-header">
        <div>
          <div className="analytics-eyebrow">
            <Activity size={14} />
            BUSINESS INTELLIGENCE
          </div>

          <h1>Analytics Overview</h1>

          <p>
            Monitor performance, discover trends, and make smarter
            decisions.
          </p>
        </div>

        <button
          type="button"
          className="analytics-date-filter"
          onClick={() =>
            window.alert(
              "The date range filter is not available yet."
            )
          }
        >
          <CalendarDays size={17} />
          Last 6 months
          <ChevronDown size={15} />
        </button>
      </div>

      <div className="analytics-report-banner">
        <div className="analytics-banner-icon">
          <ChartNoAxesCombined size={22} />
        </div>

        <div className="analytics-banner-copy">
          <strong>Business performance overview</strong>
          <span>
            Revenue and order statistics are calculated from your
            recorded transactions.
          </span>
        </div>
      </div>

      <div className="analytics-section-title">
        <div>
          <h2>Key performance indicators</h2>
          <p>A snapshot of your business performance.</p>
        </div>

        <span className="analytics-demo-label">
          <span />
          Live transaction data
        </span>
      </div>

      <div className="analytics-metrics-grid">
        {metrics.map((metric) => (
          <AnalyticsMetric
            key={metric.title}
            metric={metric}
          />
        ))}
      </div>

      <div className="analytics-charts-grid">
        <section className="analytics-panel analytics-revenue-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Revenue performance</h2>
              <p>Monthly revenue from completed transactions</p>
            </div>

            <span className="analytics-panel-icon">
              <TrendingUp size={18} />
            </span>
          </div>

          <div className="analytics-chart-summary">
            <strong>{formatCurrency(totalRevenue)}</strong>
          </div>

          <div className="analytics-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 12,
                  right: 8,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="analyticsRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#818cf8"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="#818cf8"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#273449"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(value) =>
                    `$${value / 1000}k`
                  }
                  width={48}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fill="url(#analyticsRevenueGradient)"
                  activeDot={{
                    r: 5,
                    fill: "#818cf8",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="analytics-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Order activity</h2>
              <p>Transactions recorded each month</p>
            </div>

            <span className="analytics-panel-icon orange">
              <ShoppingCart size={18} />
            </span>
          </div>

          <div className="analytics-chart-container analytics-orders-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{
                  top: 16,
                  right: 0,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="#273449"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [value, "Transactions"]}
                />

                <Bar
                  dataKey="orders"
                  fill="#fbbf24"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="analytics-orders-footer">
            <span>All recorded transactions</span>
            <strong>{totalOrders} transactions</strong>
          </div>
        </section>
      </div>

      <div className="analytics-bottom-grid">
        <section className="analytics-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Traffic sources</h2>
              <p>Illustrative visitor source breakdown</p>
            </div>

            <span className="analytics-panel-icon purple">
              <Users size={18} />
            </span>
          </div>

          <div className="analytics-channel-list">
            {channelData.map((channel) => (
              <div
                className="analytics-channel"
                key={channel.name}
              >
                <div className="analytics-channel-info">
                  <span
                    className="analytics-channel-dot"
                    style={{ background: channel.color }}
                  />

                  <span>{channel.name}</span>
                  <strong>{channel.value}%</strong>
                </div>

                <div className="analytics-channel-track">
                  <div
                    className="analytics-channel-fill"
                    style={{
                      width: `${channel.value}%`,
                      background: channel.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-panel analytics-insights-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Performance insights</h2>
              <p>Insights from your recorded transactions</p>
            </div>

            <span className="analytics-panel-icon green">
              <Zap size={18} />
            </span>
          </div>

          <div className="analytics-insight-item">
            <div className="analytics-insight-icon green">
              <TrendingUp size={17} />
            </div>

            <div>
              <strong>Revenue summary</strong>
              <p>
                {completedTransactions.length} completed transactions
                generated {formatCurrency(totalRevenue)} in revenue.
              </p>
            </div>
          </div>

          <div className="analytics-insight-item">
            <div className="analytics-insight-icon orange">
              <TrendingDown size={17} />
            </div>

            <div>
              <strong>Transaction status</strong>
              <p>
                {transactions.length - completedTransactions.length}{" "}
                transactions are not marked as completed.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="analytics-footer">
        <span>Analytics report · Nexus Analytics</span>
        <span>Based on recorded transactions</span>
      </footer>
    </section>
  );
}
