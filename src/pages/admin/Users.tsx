import { useState, useEffect, useMemo } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash2, 
  Loader2, 
  Download, 
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { userService, User } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

// Interface pour les formulaires
interface UserFormData {
  email: string;
  username: string;
  full_name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  total_xp: number;
  total_earnings: number;
  current_streak: number;
  longest_streak: number;
}

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    username: "",
    full_name: "",
    tier: "bronze",
    total_xp: 0,
    total_earnings: 0,
    current_streak: 0,
    longest_streak: 0,
  });
  const { toast } = useToast();

  // Charger les utilisateurs
  useEffect(() => {
    loadUsers();
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    try {
      setIsSearching(true);
      const data = await userService.searchUsers(searchTerm);
      setUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Filtrer les utilisateurs (pour le filtre par tier uniquement, la recherche est gérée par l'API)
  const filteredUsers = useMemo(() => {
    if (searchTerm.trim()) {
      // Si on fait une recherche, on utilise les résultats de l'API
      return users.filter(user => tierFilter === "all" || user.tier === tierFilter);
    } else {
      // Sinon, on filtre localement
      return users.filter(user => tierFilter === "all" || user.tier === tierFilter);
    }
  }, [users, tierFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Statistiques
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.current_streak > 0).length;
    const totalXP = users.reduce((sum, u) => sum + u.total_xp, 0);
    const totalEarnings = users.reduce((sum, u) => sum + u.total_earnings, 0);
    
    return { totalUsers, activeUsers, totalXP, totalEarnings };
  }, [users]);

  // Ouvrir le dialogue d'édition
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      tier: user.tier,
      total_xp: user.total_xp,
      total_earnings: user.total_earnings,
      current_streak: user.current_streak,
      longest_streak: user.longest_streak,
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue de création
  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      username: "",
      full_name: "",
      tier: "bronze",
      total_xp: 0,
      total_earnings: 0,
      current_streak: 0,
      longest_streak: 0,
    });
    setIsDialogOpen(true);
  };

  // Sauvegarder l'utilisateur
  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Mise à jour
        const updatedUser = await userService.updateUser(editingUser.id, formData);
        if (updatedUser) {
          setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
          toast({
            title: "Succès",
            description: "Utilisateur mis à jour avec succès",
          });
        }
      } else {
        // Création
        const newUser = await userService.createUser(formData);
        if (newUser) {
          setUsers([newUser, ...users]);
          toast({
            title: "Succès",
            description: "Utilisateur créé avec succès",
          });
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'utilisateur",
        variant: "destructive",
      });
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const success = await userService.deleteUser(userToDelete.id);
      if (success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  // Actions en lot
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const deletePromises = selectedUsers.map(id => userService.deleteUser(id));
      await Promise.all(deletePromises);
      
      setUsers(users.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      
      toast({
        title: "Succès",
        description: `${selectedUsers.length} utilisateur(s) supprimé(s) avec succès`,
      });
    } catch (error) {
      console.error("Error bulk deleting users:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les utilisateurs sélectionnés",
        variant: "destructive",
      });
    }
  };

  // Export des données
  const handleExportUsers = () => {
    const csvContent = [
      ['Email', 'Nom d\'utilisateur', 'Nom complet', 'Niveau', 'XP Total', 'Gains totaux', 'Série actuelle', 'Meilleure série', 'Date de création'],
      ...filteredUsers.map(user => [
        user.email,
        user.username,
        user.full_name,
        user.tier,
        user.total_xp,
        user.total_earnings,
        user.current_streak,
        user.longest_streak,
        new Date(user.created_at).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ajouter de l'XP à un utilisateur
  const handleAddXP = async (userId: string, xpAmount: number) => {
    try {
      const success = await userService.addXP(userId, xpAmount);
      if (success) {
        // Recharger les utilisateurs pour avoir les données à jour
        loadUsers();
        toast({
          title: "Succès",
          description: `${xpAmount} XP ajouté(s) avec succès`,
        });
      }
    } catch (error) {
      console.error("Error adding XP:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter de l'XP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage all users in the system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={loadUsers}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary-dark" onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalXP.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>User List ({filteredUsers.length} users)</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 md:w-64"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
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
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          )}
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-muted-foreground">Chargement des utilisateurs...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
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
                        {user.total_xp.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${user.total_earnings.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{user.current_streak} days</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogue de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tier">Niveau</Label>
                <Select
                  value={formData.tier}
                  onValueChange={(value: 'bronze' | 'silver' | 'gold' | 'platinum') => 
                    setFormData({ ...formData, tier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_xp">XP Total</Label>
                <Input
                  id="total_xp"
                  type="number"
                  value={formData.total_xp}
                  onChange={(e) => setFormData({ ...formData, total_xp: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_earnings">Gains totaux</Label>
                <Input
                  id="total_earnings"
                  type="number"
                  step="0.01"
                  value={formData.total_earnings}
                  onChange={(e) => setFormData({ ...formData, total_earnings: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_streak">Série actuelle</Label>
                <Input
                  id="current_streak"
                  type="number"
                  value={formData.current_streak}
                  onChange={(e) => setFormData({ ...formData, current_streak: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="longest_streak">Meilleure série</Label>
              <Input
                id="longest_streak"
                type="number"
                value={formData.longest_streak}
                onChange={(e) => setFormData({ ...formData, longest_streak: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
