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
  Eye, 
  Filter,
  Download, 
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Activity,
  User,
  Package,
  Tag,
  Calendar,
  Clock
} from "lucide-react";
import { activityService } from "@/supabase";

interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  xp_earned: number;
  created_at: string;
  users?: {
    full_name: string;
    username: string;
  };
  products?: {
    name: string;
  };
  categories?: {
    name: string;
  };
}

const activityTypes = [
  { value: "all", label: "Toutes les activités" },
  { value: "login", label: "Connexion" },
  { value: "purchase", label: "Achat" },
  { value: "course_completion", label: "Cours terminé" },
  { value: "referral", label: "Parrainage" },
  { value: "review", label: "Avis" },
  { value: "xp_earned", label: "XP gagné" },
];

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = useMemo(() => {
    let filtered = activities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.users?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.products?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by activity type
    if (activityTypeFilter !== "all") {
      filtered = filtered.filter(activity => activity.activity_type === activityTypeFilter);
    }

    return filtered;
  }, [activities, searchTerm, activityTypeFilter]);

  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredActivities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const getActivityTypeLabel = (type: string) => {
    const activityType = activityTypes.find(t => t.value === type);
    return activityType ? activityType.label : type;
  };

  const getActivityTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      login: "bg-blue-100 text-blue-800",
      purchase: "bg-green-100 text-green-800",
      course_completion: "bg-purple-100 text-purple-800",
      referral: "bg-orange-100 text-orange-800",
      review: "bg-yellow-100 text-yellow-800",
      xp_earned: "bg-indigo-100 text-indigo-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportActivities = () => {
    const csvContent = [
      ["Date", "Utilisateur", "Type d'activité", "Description", "XP gagné"],
      ...filteredActivities.map(activity => [
        formatDate(activity.created_at),
        activity.users?.full_name || "N/A",
        getActivityTypeLabel(activity.activity_type),
        activity.description,
        activity.xp_earned.toString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activities-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activités</h1>
          <p className="text-muted-foreground">
            Gérez et surveillez toutes les activités des utilisateurs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportActivities} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={loadActivities} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par utilisateur, description, produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'activité" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Liste des activités ({filteredActivities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedActivities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Aucune activité trouvée</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>XP</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(activity.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {activity.users?.full_name || "Utilisateur supprimé"}
                              </div>
                              <div className="text-sm text-gray-500">
                                @{activity.users?.username || "N/A"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getActivityTypeColor(activity.activity_type)}>
                            {getActivityTypeLabel(activity.activity_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {activity.description}
                          </div>
                          {activity.products && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Package className="h-3 w-3 mr-1" />
                              {activity.products.name}
                            </div>
                          )}
                          {activity.categories && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Tag className="h-3 w-3 mr-1" />
                              {activity.categories.name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-green-600">
                            <Clock className="h-4 w-4 mr-1" />
                            +{activity.xp_earned} XP
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedActivity(activity)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détails de l'activité</DialogTitle>
                              </DialogHeader>
                              {selectedActivity && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Utilisateur</Label>
                                      <p className="text-sm text-gray-600">
                                        {selectedActivity.users?.full_name || "Utilisateur supprimé"}
                                        {selectedActivity.users?.username && (
                                          <span className="text-gray-400 ml-2">
                                            (@{selectedActivity.users.username})
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Type d'activité</Label>
                                      <div className="mt-1">
                                        <Badge className={getActivityTypeColor(selectedActivity.activity_type)}>
                                          {getActivityTypeLabel(selectedActivity.activity_type)}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Date</Label>
                                      <p className="text-sm text-gray-600">
                                        {formatDate(selectedActivity.created_at)}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">XP gagné</Label>
                                      <p className="text-sm text-green-600 font-medium">
                                        +{selectedActivity.xp_earned} XP
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Description</Label>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {selectedActivity.description}
                                    </p>
                                  </div>
                                  {selectedActivity.products && (
                                    <div>
                                      <Label className="text-sm font-medium">Produit</Label>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {selectedActivity.products.name}
                                      </p>
                                    </div>
                                  )}
                                  {selectedActivity.categories && (
                                    <div>
                                      <Label className="text-sm font-medium">Catégorie</Label>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {selectedActivity.categories.name}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
                    {Math.min(currentPage * itemsPerPage, filteredActivities.length)} sur{" "}
                    {filteredActivities.length} activités
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}