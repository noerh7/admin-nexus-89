import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Mail, CheckCircle, Clock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WaitlistEntry {
  id: string;
  email: string;
  status: 'pending' | 'notified' | 'converted';
  source: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

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
  const { toast } = useToast();

  // Charger les données de la waitlist
  useEffect(() => {
    const fetchWaitlistEntries = async () => {
      try {
        const response = await fetch('/api/waitlist');
        const result = await response.json();
        
        if (result.success) {
          setWaitlistEntries(result.data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les entrées de waitlist.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching waitlist entries:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les entrées de waitlist.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlistEntries();
  }, [toast]);

  const filteredEntries = waitlistEntries.filter((entry) => {
    const matchesSearch = entry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesSource = sourceFilter === "all" || entry.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/waitlist/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const result = await response.json();
      
      if (result.success) {
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
        throw new Error(result.error);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Waitlists</h1>
          <p className="text-muted-foreground">
            Gérez les inscriptions en liste d'attente et suivez les conversions
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
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
                      <TableCell className="capitalize">{entry.source}</TableCell>
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