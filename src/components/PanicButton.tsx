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
        "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 p-0",
        "transition-all duration-300 hover:shadow-2xl",
        isActivated && "scale-110 brightness-125"
      )}
      aria-label="Emergency Panic Button - Call for immediate help"
    >
      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
        {isActivated ? (
          <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7 animate-spin" />
        ) : (
          <Phone className="w-5 h-5 sm:w-7 sm:h-7" />
        )}
        <span className="text-[10px] sm:text-xs font-bold tracking-wider">SOS</span>
      </div>
    </Button>
  );
};

export default PanicButton;
