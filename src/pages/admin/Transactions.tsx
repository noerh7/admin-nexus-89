import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Transactions() {
  const transactions = [
    { id: 1, user: "john@example.com", type: "earnings", amount: 125.50, status: "completed", description: "Product commission", date: "2024-01-22 14:30" },
    { id: 2, user: "sarah@example.com", type: "withdrawal", amount: 500.00, status: "pending", description: "Bank transfer", date: "2024-01-22 12:15" },
    { id: 3, user: "mike@example.com", type: "bonus", amount: 50.00, status: "completed", description: "Referral bonus", date: "2024-01-22 10:45" },
    { id: 4, user: "emma@example.com", type: "earnings", amount: 85.25, status: "completed", description: "Affiliate sale", date: "2024-01-22 09:20" },
    { id: 5, user: "alex@example.com", type: "withdrawal", amount: 250.00, status: "failed", description: "PayPal transfer", date: "2024-01-21 18:30" },
  ];

  const typeIcons = {
    earnings: { icon: TrendingUp, color: "bg-admin-success/10 text-admin-success" },
    withdrawal: { icon: TrendingDown, color: "bg-admin-danger/10 text-admin-danger" },
    bonus: { icon: DollarSign, color: "bg-admin-accent/10 text-admin-accent" },
    refund: { icon: DollarSign, color: "bg-admin-warning/10 text-admin-warning" },
  };

  const statusColors = {
    pending: "outline",
    completed: "default",
    failed: "destructive",
    cancelled: "secondary",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground mt-1">Monitor financial transactions and wallet activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-success/10">
              <TrendingUp className="h-6 w-6 text-admin-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">$45,280</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-danger/10">
              <TrendingDown className="h-6 w-6 text-admin-danger" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Withdrawals</p>
              <p className="text-2xl font-bold">$32,150</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-warning/10">
              <Clock className="h-6 w-6 text-admin-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">$2,840</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">$13,130</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-10" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const typeInfo = typeIcons[transaction.type as keyof typeof typeIcons];
              const Icon = typeInfo.icon;
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded ${typeInfo.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="font-semibold">
                    <span className={transaction.type === "withdrawal" ? "text-admin-danger" : "text-admin-success"}>
                      {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[transaction.status as keyof typeof statusColors] as "default" | "destructive" | "outline" | "secondary"}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
