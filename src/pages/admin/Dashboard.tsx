import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Package, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stats = [
  {
    title: "Total Users",
    value: "12,345",
    change: "+12.5%",
    icon: Users,
    color: "text-chart-1",
  },
  {
    title: "Total Earnings",
    value: "$54,321",
    change: "+8.2%",
    icon: DollarSign,
    color: "text-chart-2",
  },
  {
    title: "Active Products",
    value: "234",
    change: "+4.3%",
    icon: Package,
    color: "text-chart-3",
  },
  {
    title: "Avg Conversion",
    value: "3.8%",
    change: "+0.5%",
    icon: TrendingUp,
    color: "text-chart-4",
  },
];

const revenueData = [
  { month: "Jan", revenue: 4000, users: 240 },
  { month: "Feb", revenue: 3000, users: 220 },
  { month: "Mar", revenue: 5000, users: 290 },
  { month: "Apr", revenue: 4500, users: 270 },
  { month: "May", revenue: 6000, users: 340 },
  { month: "Jun", revenue: 5500, users: 310 },
];

const activityData = [
  { name: "Clicks", value: 4000 },
  { name: "Conversions", value: 3000 },
  { name: "XP Earned", value: 2000 },
  { name: "Referrals", value: 2780 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="2"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { user: "John Doe", action: "Completed a course", time: "2 minutes ago" },
              { user: "Jane Smith", action: "Made a conversion", time: "5 minutes ago" },
              { user: "Bob Johnson", action: "Earned 500 XP", time: "10 minutes ago" },
              { user: "Alice Williams", action: "Referred a friend", time: "15 minutes ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
