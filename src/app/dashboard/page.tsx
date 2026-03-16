"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, TrendingUp, ArrowUpRight, ExternalLink } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { format } from "date-fns";

interface DashboardStats {
  upcoming: number;
  pending: number;
  thisMonth: number;
  popular: {
    title: string;
    bookings: number;
  } | null;
}

interface UpcomingBooking {
  id: string;
  uid: string;
  title: string;
  attendeeName: string;
  attendeeEmail: string;
  startTime: string;
  endTime: string;
  eventType: {
    title: string;
    color: string;
    duration: number;
  };
}

interface ChartData {
  bookingsPerDay: { date: string; bookings: number; }[];
  bookingsByEventType: { eventType: string; bookings: number; color: string; }[];
  bookingsByStatus: { status: string; count: number; color: string; }[];
}

interface DashboardData {
  stats: DashboardStats;
  upcomingBookings: UpcomingBooking[];
  charts: ChartData;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format chart data for better display
  const formattedChartData = useMemo(() => {
    if (!data) return null;

    return {
      ...data.charts,
      bookingsPerDay: data.charts.bookingsPerDay.map(item => ({
        ...item,
        date: format(new Date(item.date), "MMM d"),
      })),
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive mb-4">Failed to load dashboard</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Upcoming",
      value: data.stats.upcoming,
      icon: Calendar,
      description: "Confirmed bookings",
      trend: "+12% from last month",
    },
    {
      title: "Pending",
      value: data.stats.pending,
      icon: Clock,
      description: "Awaiting confirmation",
      trend: "2 new today",
    },
    {
      title: "This Month",
      value: data.stats.thisMonth,
      icon: TrendingUp,
      description: "Total bookings",
      trend: "+5% from last month",
    },
    {
      title: "Popular",
      value: data.stats.popular?.bookings || 0,
      icon: Users,
      description: data.stats.popular?.title || "No data",
      trend: "Most booked event",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your scheduling activity and upcoming bookings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <div className="flex items-center pt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500 ml-1">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Upcoming Bookings */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Charts Section */}
        <div className="lg:col-span-4 space-y-4">
          {/* Line Chart - Bookings per Day */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={formattedChartData?.bookingsPerDay || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Bar Chart - Bookings by Event Type */}
            <Card>
              <CardHeader>
                <CardTitle>By Event Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.charts.bookingsByEventType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="eventType" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings">
                      {data.charts.bookingsByEventType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart - Bookings by Status */}
            <Card>
              <CardHeader>
                <CardTitle>By Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data.charts.bookingsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={80}
                      dataKey="count"
                      nameKey="status"
                    >
                      {data.charts.bookingsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Bookings</CardTitle>
            <a href="/bookings" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
              View All
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.upcomingBookings.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No upcoming bookings
                </p>
              ) : (
                data.upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-4">
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: booking.eventType.color }}
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {booking.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-muted-foreground truncate">
                          {booking.attendeeName}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {booking.eventType.duration}m
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium">
                        {format(new Date(booking.startTime), "MMM d")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.startTime), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}