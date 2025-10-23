import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, BookOpen, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { courseService, Course } from "@/supabase";
import { useToast } from "@/hooks/use-toast";

// Interface pour les formulaires
interface CourseFormData {
  title: string;
  description: string;
  thumbnail_url: string;
  xp_reward: number;
  revenue_impact: string;
  duration_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  is_premium: boolean;
  is_active: boolean;
  sort_order: number;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    thumbnail_url: "",
    xp_reward: 0,
    revenue_impact: "",
    duration_hours: 0,
    difficulty_level: "beginner",
    is_premium: false,
    is_active: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  // Charger les cours
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les cours
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ouvrir le dialogue d'édition
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      thumbnail_url: course.thumbnail_url || "",
      xp_reward: course.xp_reward,
      revenue_impact: course.revenue_impact || "",
      duration_hours: course.duration_hours || 0,
      difficulty_level: course.difficulty_level,
      is_premium: course.is_premium,
      is_active: course.is_active,
      sort_order: course.sort_order,
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue de création
  const handleCreateCourse = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      thumbnail_url: "",
      xp_reward: 0,
      revenue_impact: "",
      duration_hours: 0,
      difficulty_level: "beginner",
      is_premium: false,
      is_active: true,
      sort_order: 0,
    });
    setIsDialogOpen(true);
  };

  // Sauvegarder le cours
  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        // Mise à jour
        const updatedCourse = await courseService.updateCourse(editingCourse.id, formData);
        if (updatedCourse) {
          setCourses(courses.map(c => c.id === editingCourse.id ? updatedCourse : c));
          toast({
            title: "Succès",
            description: "Cours mis à jour avec succès",
          });
        }
      } else {
        // Création
        const newCourse = await courseService.createCourse(formData);
        if (newCourse) {
          setCourses([newCourse, ...courses]);
          toast({
            title: "Succès",
            description: "Cours créé avec succès",
          });
        }
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le cours",
        variant: "destructive",
      });
    }
  };

  // Supprimer un cours
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      return;
    }

    try {
      const success = await courseService.deleteCourse(courseId);
      if (success) {
        setCourses(courses.filter(c => c.id !== courseId));
        toast({
          title: "Succès",
          description: "Cours supprimé avec succès",
        });
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage educational content and learning paths</p>
        </div>
        <Button className="gap-2" onClick={handleCreateCourse}>
          <Plus className="h-4 w-4" />
          Add Course
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-success/10">
              <BookOpen className="h-6 w-6 text-admin-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold">2,850</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-admin-warning/10">
              <BookOpen className="h-6 w-6 text-admin-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completions</p>
              <p className="text-2xl font-bold">1,420</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>XP Reward</TableHead>
              <TableHead>Completions</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">Chargement des cours...</p>
                </TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">Aucun cours trouvé</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{course.title}</div>
                      {course.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {course.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.difficulty_level}</Badge>
                  </TableCell>
                  <TableCell>{course.duration_hours || 0}h</TableCell>
                  <TableCell className="text-primary font-semibold">{course.xp_reward} XP</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant={course.is_premium ? "default" : "secondary"}>
                      {course.is_premium ? "Premium" : "Free"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCourse(course.id)}
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
              {editingCourse ? "Modifier le cours" : "Créer un nouveau cours"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du cours</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
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
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">URL de la miniature</Label>
              <Input
                id="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xp_reward">Récompense XP</Label>
                <Input
                  id="xp_reward"
                  type="number"
                  value={formData.xp_reward}
                  onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_hours">Durée (heures)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({ ...formData, duration_hours: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Niveau de difficulté</Label>
                <Select
                  value={formData.difficulty_level}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                    setFormData({ ...formData, difficulty_level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
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
              <Label htmlFor="revenue_impact">Impact sur les revenus</Label>
              <Input
                id="revenue_impact"
                value={formData.revenue_impact}
                onChange={(e) => setFormData({ ...formData, revenue_impact: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_premium: checked })}
                />
                <Label htmlFor="is_premium">Cours premium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Cours actif</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveCourse}>
              {editingCourse ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
