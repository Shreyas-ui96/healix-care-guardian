import { Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Healix
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
            Services
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
            Emergency
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
            Records
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
            Profile
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="hero" size="sm" className="hidden sm:flex">
            Get Help Now
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
