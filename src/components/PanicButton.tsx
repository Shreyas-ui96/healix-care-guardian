import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface PanicButtonProps {
  onActivate?: () => void;
}

const PanicButton = ({ onActivate }: PanicButtonProps) => {
  const [isActivated, setIsActivated] = useState(false);

  const handlePanic = () => {
    setIsActivated(true);
    toast.error("Emergency Services Activated!", {
      description: "Ambulance dispatched. Stay calm, help is on the way.",
      duration: 5000,
    });
    onActivate?.();
    
    setTimeout(() => setIsActivated(false), 3000);
  };

  return (
    <Button
      variant="emergency"
      size="xl"
      onClick={handlePanic}
      className={`
        fixed bottom-6 right-6 z-50 rounded-full w-20 h-20 p-0
        ${isActivated ? 'scale-110' : ''}
        transition-all duration-300
      `}
      aria-label="Emergency Panic Button"
    >
      <div className="flex flex-col items-center gap-1">
        <Phone className="w-7 h-7" />
        <span className="text-xs font-bold">SOS</span>
      </div>
    </Button>
  );
};

export default PanicButton;
