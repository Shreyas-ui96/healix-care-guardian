import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

interface UrgencyBadgeProps {
  level: "normal" | "urgent" | "critical";
  className?: string;
}

const UrgencyBadge = ({ level, className }: UrgencyBadgeProps) => {
  const config = {
    normal: {
      icon: CheckCircle,
      label: "Normal",
      styles: "bg-success/10 text-success border-success/30",
    },
    urgent: {
      icon: AlertTriangle,
      label: "Urgent",
      styles: "bg-urgent/10 text-urgent border-urgent/30",
    },
    critical: {
      icon: AlertCircle,
      label: "Critical",
      styles: "bg-destructive/10 text-destructive border-destructive/30 animate-pulse",
    },
  };

  const { icon: Icon, label, styles } = config[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold",
        styles,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

export default UrgencyBadge;
