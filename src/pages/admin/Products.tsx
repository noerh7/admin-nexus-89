import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { productService, categoryService, Product, Category } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

// Interface pour les formulaires
interface ProductFormData {
  name: string;
  description: string;
  category_id: string;
  commission_rate: number;
  conversion_rate: number;
  xp_reward: number;
  average_order_value: number;
  affiliate_url: string;
  product_url: string;
  image_url: string;
  is_active: boolean;
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category_id: "",
    commission_rate: 0,
    conversion_rate: 0,
    xp_reward: 0,
    average_order_value: 0,
    affiliate_url: "",
    product_url: "",
    image_url: "",
    is_active: true,
  });
  const { toast } = useToast();

  // Charger les produits et catégories
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les produits
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtenir le nom de la catégorie
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Inconnue";
  };

  // Ouvrir le dialogue d'édition
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      category_id: product.category_id,
      commission_rate: product.commission_rate,
      conversion_rate: product.conversion_rate,
      xp_reward: product.xp_reward,
      average_order_value: product.average_order_value || 0,
      affiliate_url: product.affiliate_url || "",
      product_url: product.product_url || "",
      image_url: product.image_url || "",
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue de création
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      category_id: "",
      commission_rate: 0,
      conversion_rate: 0,
      xp_reward: 0,
      average_order_value: 0,
      affiliate_url: "",
      product_url: "",
      image_url: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  // Sauvegarder le produit
  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        // Mise à jour
        const updatedProduct = await productService.updateProduct(editingProduct.id, formData);
        if (updatedProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
          toast({
            title: "Succès",
            description: "Produit mis à jour avec succès",
          });
        }
      } else {
        // Création
        const newProduct = await productService.createProduct(formData);
        if (newProduct) {
          setProducts([newProduct, ...products]);
          toast({
            title: "Succès",
            description: "Produit créé avec succès",
          });
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le produit",
        variant: "destructive",
      });
    }
  };

  // Supprimer un produit
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const success = await productService.deleteProduct(productId);
      if (success) {
        setProducts(products.filter(p => p.id !== productId));
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit",
        variant: "destructive",
      });
    }
  };

  // Basculer le statut actif
  const handleToggleActive = async (product: Product) => {
    try {
      const updatedProduct = await productService.updateProduct(product.id, {
        is_active: !product.is_active
      });
      if (updatedProduct) {
        setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
        toast({
          title: "Succès",
          description: `Produit ${updatedProduct.is_active ? 'activé' : 'désactivé'}`,
        });
      }
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du produit",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage products and commissions</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark" onClick={handleCreateProduct}>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-muted-foreground">Chargement des produits...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">Aucun produit trouvé</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryName(product.category_id)}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {product.commission_rate}%
                      </TableCell>
                      <TableCell className="text-right">
                        {product.conversion_rate}%
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        {product.xp_reward} XP
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.average_order_value || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={product.is_active} 
                            onCheckedChange={() => handleToggleActive(product)}
                          />
                          <span className="text-sm text-muted-foreground">
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Modifier le produit" : "Créer un nouveau produit"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Catégorie</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commission_rate">Taux de commission (%)</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  step="0.01"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
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
              <div className="space-y-2">
                <Label htmlFor="xp_reward">Récompense XP</Label>
                <Input
                  id="xp_reward"
                  type="number"
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="average_order_value">Valeur moyenne de commande</Label>
                <Input
                  id="average_order_value"
                  type="number"
                  step="0.01"
                  value={formData.average_order_value}
                  onChange={(e) => setFormData({ ...formData, average_order_value: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL de l'image</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="affiliate_url">URL d'affiliation</Label>
                <Input
                  id="affiliate_url"
                  type="url"
                  value={formData.affiliate_url}
                  onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_url">URL du produit</Label>
                <Input
                  id="product_url"
                  type="url"
                  value={formData.product_url}
                  onChange={(e) => setFormData({ ...formData, product_url: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Produit actif</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveProduct}>
              {editingProduct ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
