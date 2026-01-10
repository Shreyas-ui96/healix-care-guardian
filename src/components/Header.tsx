import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onEmergencyClick?: () => void;
}

const Header = ({ onEmergencyClick }: HeaderProps = {}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  
  const handleEmergencyClick = (e: React.MouseEvent) => {
    if (isHomePage && onEmergencyClick) {
      e.preventDefault();
      onEmergencyClick();
    } else {
      navigate("/emergency");
    }
  };
  
  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Emergency", href: "/emergency", onClick: handleEmergencyClick },
    { name: "Records", href: "/records" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-glass border-b border-border/50 shadow-lg" 
            : "bg-background/80 backdrop-blur-sm border-b border-border/30"
        )}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-transform hover:scale-105">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              Healix-Health Can't Wait
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={link.onClick}
                className={cn(
                  "text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium hover:scale-105 relative group",
                  location.pathname === link.href && "text-primary"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-gradient-primary transition-all duration-300",
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </nav>

          {/* Call to Action Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="hero" 
              size="sm" 
              className="hidden sm:flex gap-2"
              aria-label="Get immediate help"
            >
              <Phone className="w-4 h-4" />
              Get Help Now
            </Button>
            
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 transition-transform rotate-90" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/95 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <nav 
          className={cn(
            "absolute top-16 left-0 right-0 bg-glass border-b border-border/50 shadow-card transition-transform duration-300",
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          )}
          aria-label="Mobile navigation"
        >
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-foreground hover:text-primary transition-all duration-200 text-base font-medium py-3 px-4 rounded-lg hover:bg-accent/50",
                  "transform transition-all",
                  location.pathname === link.href && "bg-accent/50 text-primary"
                )}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  link.onClick?.(e);
                }}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="mt-4 pt-4 border-t border-border/50">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="w-4 h-4" />
                Get Help Now
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
