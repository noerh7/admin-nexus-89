import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, Bell, CheckCircle, Star, Zap, Target, Award } from "lucide-react";
import { notificationService } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'achievement' | 'milestone' | 'streak' | 'referral' | 'course' | 'general';
  is_read: boolean;
  metadata?: any;
  created_at: string;
  users?: { full_name: string; username: string; email: string };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const typeIcons = {
    achievement: { icon: Award, color: "bg-yellow-500/10 text-yellow-500" },
    milestone: { icon: Target, color: "bg-blue-500/10 text-blue-500" },
    streak: { icon: Zap, color: "bg-orange-500/10 text-orange-500" },
    referral: { icon: Star, color: "bg-green-500/10 text-green-500" },
    course: { icon: CheckCircle, color: "bg-purple-500/10 text-purple-500" },
    general: { icon: Bell, color: "bg-gray-500/10 text-gray-500" },
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Pour l'instant, on simule des données car getAllNotifications n'existe pas encore
      const data: Notification[] = [];
      setNotifications(data);
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "read" && notification.is_read) ||
                         (statusFilter === "unread" && !notification.is_read);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Gérez les notifications des utilisateurs</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadNotifications} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Créer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Bell className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{notifications.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lues</p>
              <p className="text-2xl font-bold">{notifications.filter(n => n.is_read).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Bell className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Non lues</p>
              <p className="text-2xl font-bold">{notifications.filter(n => !n.is_read).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="text-2xl font-bold">{notifications.filter(n => n.type === 'achievement').length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des notifications ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des notifications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tous les types</option>
              <option value="achievement">Achievement</option>
              <option value="milestone">Milestone</option>
              <option value="streak">Streak</option>
              <option value="referral">Referral</option>
              <option value="course">Course</option>
              <option value="general">General</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tous les statuts</option>
              <option value="read">Lues</option>
              <option value="unread">Non lues</option>
            </select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune notification trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((notification) => {
                  const TypeIcon = typeIcons[notification.type].icon;
                  return (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="font-medium">
                          {notification.users?.full_name || notification.users?.username || 'Utilisateur inconnu'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {notification.users?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeIcons[notification.type].color}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {notification.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                      <TableCell>
                        <Badge variant={notification.is_read ? "default" : "secondary"}>
                          {notification.is_read ? "Lue" : "Non lue"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
