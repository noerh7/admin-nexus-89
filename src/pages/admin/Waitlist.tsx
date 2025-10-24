import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Mail, CheckCircle, Clock, UserPlus, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { waitlistService, WaitlistEntry } from "@/supabase";

// Interface WaitlistEntry est maintenant importée depuis @/supabase

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  notified: { label: 'Notifié', color: 'bg-blue-100 text-blue-800', icon: Mail },
  converted: { label: 'Converti', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

export default function Waitlist() {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Charger les données de la waitlist depuis Supabase
  useEffect(() => {
    const fetchWaitlistEntries = async () => {
      try {
        setLoading(true);
        const entries = await waitlistService.getAllWaitlistEntries();
        setWaitlistEntries(entries);
        
        // Afficher un message de succès si c'est la première fois
        if (entries.length > 0) {
          toast({
            title: "Données chargées",
            description: `${entries.length} entrée(s) de waitlist chargée(s) depuis Supabase.`,
          });
        }
      } catch (error) {
        console.error('Error fetching waitlist entries:', error);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter à la base de données. Vérifiez votre connexion.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistEntries();
  }, [toast]);

  // Fonction pour recharger les données
  const refreshData = async () => {
    try {
      setLoading(true);
      const entries = await waitlistService.getAllWaitlistEntries();
      setWaitlistEntries(entries);
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de recharger les données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rechercher dans Supabase
  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      refreshData();
      return;
    }

    try {
      setIsSearching(true);
      const results = await waitlistService.searchWaitlistEntries(query);
      setWaitlistEntries(results);
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher dans la waitlist.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Fonction pour gérer les changements de filtres
  const handleFilterChange = () => {
    // Les filtres sont appliqués côté client, pas besoin de recharger
  };

  // Appliquer les filtres côté client pour les données déjà chargées
  const filteredEntries = waitlistEntries.filter((entry) => {
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesSource = sourceFilter === "all" || entry.source === sourceFilter;
    
    return matchesStatus && matchesSource;
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const success = await waitlistService.updateWaitlistStatus(id, newStatus as 'pending' | 'notified' | 'converted');
      
      if (success) {
        setWaitlistEntries(prev => 
          prev.map(entry => 
            entry.id === id ? { ...entry, status: newStatus as any, updated_at: new Date().toISOString() } : entry
          )
        );
        toast({
          title: "Statut mis à jour",
          description: "Le statut de l'entrée a été mis à jour avec succès.",
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      "Email,Status,Source,Created At,Updated At",
      ...filteredEntries.map(entry => 
        `"${entry.email}","${entry.status}","${entry.source}","${entry.created_at}","${entry.updated_at}"`
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Fonction pour ajouter une nouvelle entrée (pour les tests)
  const handleAddTestEntry = async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    try {
      const newEntry = await waitlistService.createWaitlistEntry({
        email: testEmail,
        status: 'pending',
        source: 'admin',
        metadata: { added_by: 'admin' }
      });
      
      if (newEntry) {
        setWaitlistEntries(prev => [newEntry, ...prev]);
        toast({
          title: "Entrée ajoutée",
          description: "Une nouvelle entrée de test a été ajoutée.",
        });
      }
    } catch (error) {
      console.error('Error adding test entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'entrée de test.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour supprimer une entrée
  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      return;
    }

    try {
      const success = await waitlistService.deleteWaitlistEntry(id);
      
      if (success) {
        setWaitlistEntries(prev => prev.filter(entry => entry.id !== id));
        toast({
          title: "Entrée supprimée",
          description: "L'entrée a été supprimée avec succès.",
        });
      } else {
        throw new Error('Failed to delete entry');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée.",
        variant: "destructive",
      });
    }
  };

  // Calculer les statistiques à partir des données filtrées
  const stats = {
    total: waitlistEntries.length,
    pending: waitlistEntries.filter(e => e.status === 'pending').length,
    notified: waitlistEntries.filter(e => e.status === 'notified').length,
    converted: waitlistEntries.filter(e => e.status === 'converted').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des waitlists...</p>
        </div>
      </div>
    );
  }

  if (waitlistEntries.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestion des Waitlists</h1>
            <p className="text-muted-foreground">
              Gérez les inscriptions en liste d'attente et suivez les conversions
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
            <Button onClick={handleAddTestEntry} variant="outline" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Ajouter Test
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune inscription trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Il n'y a actuellement aucune inscription dans la waitlist.
              </p>
              <Button onClick={handleAddTestEntry} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Ajouter une entrée de test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Waitlists</h1>
          <p className="text-muted-foreground">
            Gérez les inscriptions en liste d'attente et suivez les conversions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button onClick={handleAddTestEntry} variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Ajouter Test
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifiés</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.notified}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convertis</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.converted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher par email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Délai pour éviter trop de requêtes
                    const timeoutId = setTimeout(() => {
                      handleSearch(e.target.value);
                    }, 500);
                    return () => clearTimeout(timeoutId);
                  }}
                  className="pl-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="notified">Notifié</SelectItem>
                <SelectItem value="converted">Converti</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(value) => {
              setSourceFilter(value);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrer par source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                <SelectItem value="website">Site web</SelectItem>
                <SelectItem value="social">Réseaux sociaux</SelectItem>
                <SelectItem value="referral">Parrainage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des waitlists */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des inscriptions ({filteredEntries.length})</CardTitle>
            <CardDescription>
              Gérez les inscriptions en liste d'attente et mettez à jour leur statut
              {searchTerm && (
                <span className="block mt-2 text-sm text-blue-600">
                  Recherche: "{searchTerm}" - {filteredEntries.length} résultat(s)
                </span>
              )}
            </CardDescription>
          </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Dernière mise à jour</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => {
                  const StatusIcon = statusConfig[entry.status].icon;
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.email}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[entry.status].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[entry.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {entry.source}
                        {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {Object.entries(entry.metadata).map(([key, value]) => (
                              <div key={key}>
                                {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(entry.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(entry.updated_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={entry.status}
                            onValueChange={(value) => handleStatusUpdate(entry.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="notified">Notifié</SelectItem>
                              <SelectItem value="converted">Converti</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune inscription trouvée avec les filtres actuels.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}