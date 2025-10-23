import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Bell, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Announcements() {
  const announcements = [
    { id: 1, title: "Platform Update", type: "info", priority: 1, isActive: true, views: 1250, startDate: "2024-01-15", endDate: "2024-02-15" },
    { id: 2, title: "New Rewards Available", type: "success", priority: 2, isActive: true, views: 890, startDate: "2024-01-20", endDate: null },
    { id: 3, title: "Maintenance Scheduled", type: "warning", priority: 3, isActive: true, views: 2100, startDate: "2024-01-10", endDate: "2024-01-12" },
    { id: 4, title: "Important Security Update", type: "error", priority: 5, isActive: false, views: 3200, startDate: "2024-01-05", endDate: "2024-01-08" },
  ];

  const typeIcons = {
    info: { icon: Info, color: "bg-blue-500/10 text-blue-500" },
    success: { icon: CheckCircle, color: "bg-admin-success/10 text-admin-success" },
    warning: { icon: AlertCircle, color: "bg-admin-warning/10 text-admin-warning" },
    error: { icon: AlertCircle, color: "bg-admin-danger/10 text-admin-danger" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Create and manage platform-wide announcements</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-accent/10">
              <Bell className="h-6 w-6 text-admin-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">7,440</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-success/10">
              <Bell className="h-6 w-6 text-admin-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Engagement</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search announcements..." className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => {
              const typeInfo = typeIcons[announcement.type as keyof typeof typeIcons];
              const Icon = typeInfo.icon;
              return (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded ${typeInfo.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {announcement.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{announcement.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">P{announcement.priority}</Badge>
                  </TableCell>
                  <TableCell>{announcement.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={announcement.isActive ? "default" : "secondary"}>
                      {announcement.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {announcement.startDate} → {announcement.endDate || "Ongoing"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
