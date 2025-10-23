import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Package, TrendingUp, Loader2 } from "lucide-react";
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
import { statsService, activityService } from "@/supabase";

// Interface pour les statistiques
interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalCourses: number;
  totalEarnings: number;
  totalXP: number;
}

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [generalStats, activities] = await Promise.all([
        statsService.getGeneralStats(),
        activityService.getAllActivities()
      ]);
      
      setStats(generalStats);
      // Prendre les 5 dernières activités
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers.toLocaleString() || "0",
      change: "+12.5%",
      icon: Users,
      color: "text-chart-1",
    },
    {
      title: "Total Earnings",
      value: `$${stats?.totalEarnings.toLocaleString() || "0"}`,
      change: "+8.2%",
      icon: DollarSign,
      color: "text-chart-2",
    },
    {
      title: "Active Products",
      value: stats?.totalProducts.toLocaleString() || "0",
      change: "+4.3%",
      icon: Package,
      color: "text-chart-3",
    },
    {
      title: "Total XP",
      value: stats?.totalXP.toLocaleString() || "0",
      change: "+0.5%",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Chargement...
                </CardTitle>
                <Loader2 className="h-4 w-4 animate-spin" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Chargement...</p>
              </CardContent>
            </Card>
          ))
        ) : (
          statsCards.map((stat) => (
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
          ))
        )}
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="ml-2 text-muted-foreground">Chargement des activités...</p>
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune activité récente</p>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="font-medium">
                      {activity.users?.full_name || "Utilisateur inconnu"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.activity_type} - {activity.xp_earned} XP
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
