"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatDate } from "@/lib/utils";

interface BookingsByDay {
  date: string;
  count: number;
}

interface BookingsByEventType {
  title: string;
  count: number;
}

interface BookingsByStatus {
  ACCEPTED: number;
  PENDING: number;
  CANCELLED: number;
}

interface DashboardChartsProps {
  bookingsByDay: BookingsByDay[];
  bookingsByEventType: BookingsByEventType[];
  bookingsByStatus: BookingsByStatus;
}

const STATUS_COLORS = {
  ACCEPTED: "#22c55e",
  PENDING: "#f59e0b",
  CANCELLED: "#ef4444",
};

const STATUS_LABELS = {
  ACCEPTED: "Confirmed",
  PENDING: "Pending",
  CANCELLED: "Cancelled",
};

const LINE_COLOR = "#3b82f6";
const BAR_COLOR = "#3b82f6";

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-48 items-center justify-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

export function DashboardCharts({
  bookingsByDay,
  bookingsByEventType,
  bookingsByStatus,
}: DashboardChartsProps) {
  const totalStatus =
    bookingsByStatus.ACCEPTED + bookingsByStatus.PENDING + bookingsByStatus.CANCELLED;

  const statusData = [
    {
      name: STATUS_LABELS.ACCEPTED,
      value: bookingsByStatus.ACCEPTED,
      color: STATUS_COLORS.ACCEPTED,
    },
    {
      name: STATUS_LABELS.PENDING,
      value: bookingsByStatus.PENDING,
      color: STATUS_COLORS.PENDING,
    },
    {
      name: STATUS_LABELS.CANCELLED,
      value: bookingsByStatus.CANCELLED,
      color: STATUS_COLORS.CANCELLED,
    },
  ].filter((d) => d.value > 0);

  // Show only every 5th label to avoid crowding
  const xAxisTickFormatter = (_: string, index: number) => {
    if (index % 5 !== 0) return "";
    return formatDate(bookingsByDay[index]?.date ?? "", "MMM d");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Line chart: bookings over time */}
      <div className="lg:col-span-2">
        <ChartCard title="Bookings Over Time (Last 30 Days)">
          {bookingsByDay.every((d) => d.count === 0) ? (
            <EmptyChart message="No bookings in the last 30 days" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={bookingsByDay}
                margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tickFormatter={xAxisTickFormatter}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [value, "Bookings"]}
                  labelFormatter={(label) =>
                    typeof label === "string" ? formatDate(label, "MMM d, yyyy") : String(label)
                  }
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={LINE_COLOR}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: LINE_COLOR }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Donut chart: bookings by status */}
      <ChartCard title="Bookings by Status (Last 30 Days)">
        {totalStatus === 0 ? (
          <EmptyChart message="No bookings yet" />
        ) : (
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {statusData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                    aria-hidden="true"
                  />
                  <span className="text-xs text-gray-600">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ChartCard>

      {/* Bar chart: bookings by event type */}
      <div className="lg:col-span-3">
        <ChartCard title="Bookings by Event Type">
          {bookingsByEventType.length === 0 ? (
            <EmptyChart message="No bookings yet" />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, bookingsByEventType.length * 36)}>
              <BarChart
                data={bookingsByEventType.slice(0, 10)}
                layout="vertical"
                margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={140}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: string) =>
                    value.length > 22 ? `${value.slice(0, 22)}…` : value
                  }
                />
                <Tooltip
                  formatter={(value) => [value, "Bookings"]}
                  contentStyle={{
                    borderRadius: "0.5rem",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
