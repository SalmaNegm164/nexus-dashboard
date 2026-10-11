
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const revenueData = {
  Monthly: [
    { month: "Jan", revenue: 18000 },
    { month: "Feb", revenue: 24000 },
    { month: "Mar", revenue: 21000 },
    { month: "Apr", revenue: 32000 },
    { month: "May", revenue: 28000 },
    { month: "Jun", revenue: 36000 },
    { month: "Jul", revenue: 31000 },
    { month: "Aug", revenue: 42000 },
    { month: "Sep", revenue: 38000 },
    { month: "Oct", revenue: 46000 },
    { month: "Nov", revenue: 41000 },
    { month: "Dec", revenue: 48294 },
  ],
  Weekly: [
    { month: "Mon", revenue: 4200 },
    { month: "Tue", revenue: 6100 },
    { month: "Wed", revenue: 5300 },
    { month: "Thu", revenue: 7800 },
    { month: "Fri", revenue: 6900 },
    { month: "Sat", revenue: 9200 },
    { month: "Sun", revenue: 8400 },
  ],
  Daily: [
    { month: "9 AM", revenue: 1200 },
    { month: "11 AM", revenue: 2400 },
    { month: "1 PM", revenue: 1800 },
    { month: "3 PM", revenue: 3600 },
    { month: "5 PM", revenue: 2900 },
    { month: "7 PM", revenue: 4700 },
    { month: "9 PM", revenue: 3900 },
  ],
};

function RevenueChart({ chartPeriod, setChartPeriod }) {
  return (
    <section className="panel revenue-panel">
      <div className="panel-heading">
        <div>
          <h2>Revenue Overview</h2>
          <p>Your revenue performance over time.</p>
        </div>

        <select
          className="chart-period"
          value={chartPeriod}
          onChange={(event) => setChartPeriod(event.target.value)}
          aria-label="Select chart period"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData[chartPeriod]}
            margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#6488ff"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="#6488ff"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#293447"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#8491a6", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickMargin={12}
            />

            <YAxis
              tick={{ fill: "#8491a6", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                background: "#111a2a",
                border: "1px solid #34445e",
                borderRadius: "10px",
                color: "#f1f5f9",
                fontSize: "12px",
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
              labelStyle={{
                color: "#a9bbdb",
                marginBottom: "5px",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7294ff"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{
                r: 5,
                fill: "#7294ff",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default RevenueChart;
