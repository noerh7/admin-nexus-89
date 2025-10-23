import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { categoryService, Category } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

// Interface pour les formulaires
interface CategoryFormData {
  name: string;
  slug: string;
  icon: string;
  description: string;
  avg_commission: number;
  conversion_rate: number;
  active_creators: number;
  avg_xp: number;
  badge_text: string;
  badge_color: string;
  is_active: boolean;
  sort_order: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    icon: "",
    description: "",
    avg_commission: 0,
    conversion_rate: 0,
    active_creators: 0,
    avg_xp: 0,
    badge_text: "",
    badge_color: "",
    is_active: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  // Charger les catégories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les catégories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ouvrir le dialogue d'édition
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description || "",
      avg_commission: category.avg_commission,
      conversion_rate: category.conversion_rate,
      active_creators: category.active_creators,
      avg_xp: category.avg_xp,
      badge_text: category.badge_text || "",
      badge_color: category.badge_color || "",
      is_active: category.is_active,
      sort_order: category.sort_order,
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue de création
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      icon: "",
      description: "",
      avg_commission: 0,
      conversion_rate: 0,
      active_creators: 0,
      avg_xp: 0,
      badge_text: "",
      badge_color: "",
      is_active: true,
      sort_order: 0,
    });
    setIsDialogOpen(true);
  };

  // Sauvegarder la catégorie
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        // Mise à jour
        const updatedCategory = await categoryService.updateCategory(editingCategory.id, formData);
        if (updatedCategory) {
          setCategories(categories.map(c => c.id === editingCategory.id ? updatedCategory : c));
          toast({
            title: "Succès",
            description: "Catégorie mise à jour avec succès",
          });
        }
      } else {
        // Création
        const newCategory = await categoryService.createCategory(formData);
        if (newCategory) {
          setCategories([newCategory, ...categories]);
          toast({
            title: "Succès",
            description: "Catégorie créée avec succès",
          });
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        variant: "destructive",
      });
    }
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      return;
    }

    try {
      const success = await categoryService.deleteCategory(categoryId);
      if (success) {
        setCategories(categories.filter(c => c.id !== categoryId));
        toast({
          title: "Succès",
          description: "Catégorie supprimée avec succès",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage product categories and their settings</p>
        </div>
        <Button className="gap-2" onClick={handleCreateCategory}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search categories..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Avg Commission</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead>Active Creators</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">Chargement des catégories...</p>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">Aucune catégorie trouvée</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell>{category.avg_commission}%</TableCell>
                  <TableCell>{category.conversion_rate}%</TableCell>
                  <TableCell>{category.active_creators}</TableCell>
                  <TableCell>
                    <Badge variant={category.is_active ? "default" : "secondary"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
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
      </Card>

      {/* Dialogue de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icône (emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="💻"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sort_order">Ordre de tri</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avg_commission">Commission moyenne (%)</Label>
                <Input
                  id="avg_commission"
                  type="number"
                  step="0.01"
                  value={formData.avg_commission}
                  onChange={(e) => setFormData({ ...formData, avg_commission: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conversion_rate">Taux de conversion (%)</Label>
                <Input
                  id="conversion_rate"
                  type="number"
                  step="0.01"
                  value={formData.conversion_rate}
                  onChange={(e) => setFormData({ ...formData, conversion_rate: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="active_creators">Créateurs actifs</Label>
                <Input
                  id="active_creators"
                  type="number"
                  value={formData.active_creators}
                  onChange={(e) => setFormData({ ...formData, active_creators: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avg_xp">XP moyen</Label>
                <Input
                  id="avg_xp"
                  type="number"
                  value={formData.avg_xp}
                  onChange={(e) => setFormData({ ...formData, avg_xp: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badge_text">Texte du badge</Label>
                <Input
                  id="badge_text"
                  value={formData.badge_text}
                  onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge_color">Couleur du badge</Label>
                <Input
                  id="badge_color"
                  value={formData.badge_color}
                  onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Catégorie active</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
