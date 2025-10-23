import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Activity, TrendingUp, MousePointer, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Activities() {
  const activities = [
    { id: 1, user: "john@example.com", type: "conversion", product: "Premium Plan", xp: 250, earnings: 45.00, timestamp: "2 mins ago" },
    { id: 2, user: "sarah@example.com", type: "click", product: "Starter Pack", xp: 10, earnings: 0, timestamp: "5 mins ago" },
    { id: 3, user: "mike@example.com", type: "xp_earned", product: "Course Completion", xp: 500, earnings: 0, timestamp: "12 mins ago" },
    { id: 4, user: "emma@example.com", type: "conversion", product: "Elite Package", xp: 500, earnings: 125.00, timestamp: "18 mins ago" },
    { id: 5, user: "alex@example.com", type: "tier_upgraded", product: "Gold Tier", xp: 1000, earnings: 0, timestamp: "25 mins ago" },
  ];

  const activityTypes = {
    click: { icon: MousePointer, color: "bg-blue-500/10 text-blue-500", label: "Click" },
    conversion: { icon: TrendingUp, color: "bg-admin-success/10 text-admin-success", label: "Conversion" },
    xp_earned: { icon: Award, color: "bg-admin-accent/10 text-admin-accent", label: "XP Earned" },
    tier_upgraded: { icon: Activity, color: "bg-purple-500/10 text-purple-500", label: "Tier Up" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activities</h1>
        <p className="text-muted-foreground mt-1">Monitor user activities and engagement in real-time</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-accent/10">
              <Activity className="h-6 w-6 text-admin-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
              <p className="text-2xl font-bold">12,543</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <MousePointer className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Clicks Today</p>
              <p className="text-2xl font-bold">3,842</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-success/10">
              <TrendingUp className="h-6 w-6 text-admin-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversions Today</p>
              <p className="text-2xl font-bold">284</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-warning/10">
              <Award className="h-6 w-6 text-admin-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">XP Earned Today</p>
              <p className="text-2xl font-bold">125,400</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search activities..." className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Activity Type</TableHead>
              <TableHead>Product/Action</TableHead>
              <TableHead>XP Earned</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => {
              const typeInfo = activityTypes[activity.type as keyof typeof activityTypes];
              const Icon = typeInfo.icon;
              return (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded ${typeInfo.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{typeInfo.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>{activity.product}</TableCell>
                  <TableCell className="text-admin-accent font-semibold">+{activity.xp} XP</TableCell>
                  <TableCell className="text-admin-success font-semibold">
                    {activity.earnings > 0 ? `$${activity.earnings.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
