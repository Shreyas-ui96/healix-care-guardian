import { Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PanicButtonProps {
  onActivate?: () => void;
  onEmergencyClick?: () => void;
}

const PanicButton = ({ onActivate, onEmergencyClick }: PanicButtonProps) => {
  const [isActivated, setIsActivated] = useState(false);

  const handlePanic = () => {
    setIsActivated(true);
    toast.error("Emergency Services Activated!", {
      description: "Ambulance dispatched. Stay calm, help is on the way.",
      duration: 5000,
    });
    onActivate?.();
    onEmergencyClick?.();
    
    setTimeout(() => setIsActivated(false), 3000);
  };

  return (
    <Button
      variant="emergency"
      size="xl"
      onClick={handlePanic}
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full w-20 h-20 p-0",
        "transition-all duration-300 hover:shadow-2xl",
        isActivated && "scale-110 brightness-125"
      )}
      aria-label="Emergency Panic Button - Call for immediate help"
    >
      <div className="flex flex-col items-center gap-1">
        {isActivated ? (
          <AlertCircle className="w-7 h-7 animate-spin" />
        ) : (
          <Phone className="w-7 h-7" />
        )}
        <span className="text-xs font-bold tracking-wider">SOS</span>
      </div>
    </Button>
  );
};

export default PanicButton;
