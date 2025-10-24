import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, TrendingUp, DollarSign, Users, Loader2, RefreshCw } from "lucide-react";
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
import { referralService } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

interface ReferralData {
  id: string;
  referrer_id: string;
  referred_email: string;
  referral_code: string;
  status: 'pending' | 'accepted' | 'completed';
  bonus_earned: number;
  xp_earned: number;
  created_at: string;
  accepted_at?: string;
  completed_at?: string;
  users?: { full_name: string; username: string; email: string };
}

export default function Referrals() {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const statusColors = {
    pending: "secondary",
    accepted: "outline",
    completed: "default",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Referral Program</h1>
        <p className="text-muted-foreground mt-1">Track referrals and monitor program performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold">1,284</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-success/10">
              <TrendingUp className="h-6 w-6 text-admin-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">42%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-accent/10">
              <DollarSign className="h-6 w-6 text-admin-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bonuses</p>
              <p className="text-2xl font-bold">$12,840</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-warning/10">
              <Users className="h-6 w-6 text-admin-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Referrers</p>
              <p className="text-2xl font-bold">542</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search referrals..." className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referrer</TableHead>
              <TableHead>Referred User</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bonus Earned</TableHead>
              <TableHead>XP Earned</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell className="font-medium">{referral.referrer}</TableCell>
                <TableCell>{referral.referred}</TableCell>
                <TableCell>
                  <Badge variant="outline">{referral.code}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[referral.status as keyof typeof statusColors] as "default" | "secondary" | "outline"}>
                    {referral.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-admin-success font-semibold">
                  {referral.bonusEarned > 0 ? `$${referral.bonusEarned.toFixed(2)}` : "-"}
                </TableCell>
                <TableCell className="text-admin-accent font-semibold">
                  {referral.xpEarned > 0 ? `+${referral.xpEarned} XP` : "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">{referral.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
