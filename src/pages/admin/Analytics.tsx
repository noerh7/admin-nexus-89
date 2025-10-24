import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Activity,
  RefreshCw,
  Loader2,
  Calendar,
  Download
} from "lucide-react";
import { statsService } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

interface GeneralStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalCourses: number;
  totalEarnings: number;
  totalXP: number;
}

interface UserStatsByTier {
  tier: string;
  count: number;
}

export default function Analytics() {
  const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
  const [userStatsByTier, setUserStatsByTier] = useState<UserStatsByTier[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [stats, tierStats] = await Promise.all([
        statsService.getGeneralStats(),
        statsService.getUserStatsByTier()
      ]);
      setGeneralStats(stats);
      setUserStatsByTier(tierStats);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Tableau de bord des statistiques et métriques</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadAnalytics} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Utilisateurs</p>
              <p className="text-2xl font-bold">{generalStats?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Target className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Produits</p>
              <p className="text-2xl font-bold">{generalStats?.totalProducts || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Catégories</p>
              <p className="text-2xl font-bold">{generalStats?.totalCategories || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cours</p>
              <p className="text-2xl font-bold">{generalStats?.totalCourses || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <DollarSign className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gains totaux</p>
              <p className="text-2xl font-bold">${generalStats?.totalEarnings?.toLocaleString() || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-red-500/10">
              <TrendingUp className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">XP total</p>
              <p className="text-2xl font-bold">{generalStats?.totalXP?.toLocaleString() || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Répartition par tier */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des utilisateurs par tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {userStatsByTier.map((stat) => {
              const tierColors = {
                bronze: "bg-amber-500/10 text-amber-500",
                silver: "bg-gray-400/10 text-gray-400",
                gold: "bg-yellow-500/10 text-yellow-500",
                platinum: "bg-purple-500/10 text-purple-500",
              };
              
              return (
                <div key={stat.tier} className="flex items-center gap-3 p-4 border rounded-lg">
                  <Badge className={tierColors[stat.tier as keyof typeof tierColors]}>
                    {stat.tier.toUpperCase()}
                  </Badge>
                  <div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-sm text-muted-foreground">utilisateurs</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Graphiques et métriques avancées */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Graphiques d'activité en cours de développement</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métriques de performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Métriques avancées en cours de développement</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
