import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Rewards() {
  const rewards = [
    { id: 1, name: "First Sale", tier: "Bronze", xpRequired: 100, earningsRequired: 0, unlockedBy: 450, isActive: true },
    { id: 2, name: "Top Performer", tier: "Silver", xpRequired: 1000, earningsRequired: 500, unlockedBy: 180, isActive: true },
    { id: 3, name: "Elite Creator", tier: "Gold", xpRequired: 5000, earningsRequired: 2500, unlockedBy: 45, isActive: true },
    { id: 4, name: "Master Affiliate", tier: "Platinum", xpRequired: 10000, earningsRequired: 10000, unlockedBy: 12, isActive: true },
  ];

  const tierColors = {
    Bronze: "bg-orange-500/10 text-orange-500",
    Silver: "bg-gray-400/10 text-gray-400",
    Gold: "bg-yellow-500/10 text-yellow-500",
    Platinum: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rewards</h1>
          <p className="text-muted-foreground mt-1">Manage achievement tiers and reward milestones</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Reward
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {["Bronze", "Silver", "Gold", "Platinum"].map((tier) => (
          <Card key={tier} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${tierColors[tier as keyof typeof tierColors]}`}>
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{tier} Tier</p>
                <p className="text-2xl font-bold">{tier === "Bronze" ? 450 : tier === "Silver" ? 180 : tier === "Gold" ? 45 : 12}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search rewards..." className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reward Name</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>XP Required</TableHead>
              <TableHead>Earnings Required</TableHead>
              <TableHead>Unlocked By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell className="font-medium">{reward.name}</TableCell>
                <TableCell>
                  <Badge className={tierColors[reward.tier as keyof typeof tierColors]}>
                    {reward.tier}
                  </Badge>
                </TableCell>
                <TableCell className="text-admin-accent font-semibold">{reward.xpRequired.toLocaleString()} XP</TableCell>
                <TableCell>${reward.earningsRequired.toLocaleString()}</TableCell>
                <TableCell>{reward.unlockedBy} users</TableCell>
                <TableCell>
                  <Badge variant={reward.isActive ? "default" : "secondary"}>
                    {reward.isActive ? "Active" : "Inactive"}
                  </Badge>
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
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
