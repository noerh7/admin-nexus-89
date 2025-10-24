import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  BookOpen, 
  Trophy,
  Activity,
  Bell,
  UserPlus,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  List,
  MessageSquare,
  BarChart3,
  Star,
  Target,
  Cog,
  Shield,
  Heart,
  MousePointer,
  TrendingUp,
  Calendar,
  Award,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, end: true },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Package },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Rewards", href: "/admin/rewards", icon: Trophy },
  { name: "Activities", href: "/admin/activities", icon: Activity },
  { name: "Announcements", href: "/admin/announcements", icon: Bell },
  { name: "Referrals", href: "/admin/referrals", icon: UserPlus },
  { name: "Waitlist", href: "/admin/waitlist", icon: List },
  { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar = ({ open, onToggle }: AdminSidebarProps) => {
  return (
    <aside 
      className={cn(
        "relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
        {open && (
          <h1 className="text-lg font-bold text-sidebar-foreground">
            Admin Panel
          </h1>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar hover:bg-sidebar-accent"
      >
        {open ? (
          <ChevronLeft className="h-4 w-4 text-sidebar-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
        )}
      </Button>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {open && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
