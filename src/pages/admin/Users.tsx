import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus, Eye, Edit, Trash2 } from "lucide-react";

const mockUsers = [
  {
    id: "1",
    email: "john@example.com",
    username: "johndoe",
    fullName: "John Doe",
    tier: "gold",
    totalXp: 12500,
    totalEarnings: 5432.50,
    currentStreak: 15,
  },
  {
    id: "2",
    email: "jane@example.com",
    username: "janesmith",
    fullName: "Jane Smith",
    tier: "platinum",
    totalXp: 25000,
    totalEarnings: 12345.00,
    currentStreak: 30,
  },
  {
    id: "3",
    email: "bob@example.com",
    username: "bobjohnson",
    fullName: "Bob Johnson",
    tier: "silver",
    totalXp: 5000,
    totalEarnings: 1234.50,
    currentStreak: 7,
  },
];

const getTierColor = (tier: string) => {
  const colors = {
    bronze: "bg-amber-700 text-white",
    silver: "bg-slate-400 text-white",
    gold: "bg-yellow-500 text-white",
    platinum: "bg-purple-600 text-white",
  };
  return colors[tier as keyof typeof colors] || "bg-gray-500 text-white";
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage all users in the system</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>User List</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 md:w-64"
                />
              </div>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Total XP</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                  <TableHead className="text-right">Streak</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierColor(user.tier)}>
                        {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {user.totalXp.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${user.totalEarnings.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{user.currentStreak} days</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
