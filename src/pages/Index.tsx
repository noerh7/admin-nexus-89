import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Modern, professional admin interface for managing your platform
        </p>
        <Link to="/admin">
          <Button size="lg" className="bg-primary hover:bg-primary-dark mt-4">
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
