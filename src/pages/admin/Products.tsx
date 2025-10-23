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
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const mockProducts = [
  {
    id: "1",
    name: "Premium Sneakers",
    category: "Fashion",
    commissionRate: 15,
    conversionRate: 4.2,
    xpReward: 500,
    averageOrderValue: 120,
    isActive: true,
  },
  {
    id: "2",
    name: "Fitness Tracker",
    category: "Electronics",
    commissionRate: 10,
    conversionRate: 3.8,
    xpReward: 300,
    averageOrderValue: 89.99,
    isActive: true,
  },
  {
    id: "3",
    name: "Organic Coffee Beans",
    category: "Food & Beverage",
    commissionRate: 20,
    conversionRate: 5.5,
    xpReward: 200,
    averageOrderValue: 24.99,
    isActive: false,
  },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage products and commissions</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Product List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 md:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                  <TableHead className="text-right">Conv. Rate</TableHead>
                  <TableHead className="text-right">XP Reward</TableHead>
                  <TableHead className="text-right">Avg Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {product.commissionRate}%
                    </TableCell>
                    <TableCell className="text-right">
                      {product.conversionRate}%
                    </TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {product.xpReward} XP
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.averageOrderValue}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={product.isActive} />
                        <span className="text-sm text-muted-foreground">
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
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
