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
import { Search, Plus, Edit, Trash2, Loader2, RefreshCw, Star } from "lucide-react";
import { testimonialService } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  user_id: string;
  name: string;
  handle: string;
  tier: string;
  tier_color: string;
  earnings: string;
  quote: string;
  avatar_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  users?: { full_name: string; username: string };
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error loading testimonials:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les témoignages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.quote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des témoignages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Témoignages</h1>
          <p className="text-muted-foreground mt-1">Gérez les témoignages des utilisateurs</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadTestimonials} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des témoignages ({filteredTestimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des témoignages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Gains</TableHead>
                <TableHead>Citation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun témoignage trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredTestimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {testimonial.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">@{testimonial.handle}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        style={{ backgroundColor: testimonial.tier_color, color: 'white' }}
                      >
                        {testimonial.tier.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{testimonial.earnings}</TableCell>
                    <TableCell className="max-w-xs truncate">{testimonial.quote}</TableCell>
                    <TableCell>
                      <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                        {testimonial.is_active ? "Actif" : "Inactif"}
                      </Badge>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
