import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  urgency?: "normal" | "urgent" | "critical";
  onClick?: () => void;
}

const ServiceCard = ({ icon: Icon, title, description, urgency = "normal", onClick }: ServiceCardProps) => {
  const urgencyStyles = {
    normal: "border-border hover:border-primary/50 hover:shadow-glow",
    urgent: "border-urgent/30 hover:border-urgent/60 bg-urgent/5",
    critical: "border-destructive/30 hover:border-destructive/60 bg-destructive/5 hover:shadow-emergency",
  };

  const iconStyles = {
    normal: "bg-primary/10 text-primary",
    urgent: "bg-urgent/10 text-urgent",
    critical: "bg-destructive/10 text-destructive",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300",
        "hover:scale-[1.02] active:scale-[0.98]",
        "text-left group cursor-pointer",
        urgencyStyles[urgency]
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
        iconStyles[urgency]
      )}>
        <Icon className="w-6 h-6" />
      </div>
      
      <h3 className="font-display font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </button>
  );
};

export default ServiceCard;
