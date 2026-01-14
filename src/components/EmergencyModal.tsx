import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Phone, 
  Ambulance, 
  AlertTriangle,
  Heart,
  MapPin,
  Users,
  Activity,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmergencyModal = ({ open, onOpenChange }: EmergencyModalProps) => {
  const handleEmergencyCall = () => {
    toast.error("Emergency Call Initiated", {
      description: "Connecting to emergency services...",
      duration: 3000,
    });
  };

  const emergencyTypes = [
    {
      icon: Heart,
      title: "Cardiac Emergency",
      symptoms: ["Chest pain", "Shortness of breath", "Irregular heartbeat"],
      action: "Call 911 immediately",
      color: "from-red-500 to-rose-600",
    },
    {
      icon: Activity,
      title: "Stroke Alert",
      symptoms: ["Facial drooping", "Arm weakness", "Speech difficulty"],
      action: "Act F.A.S.T - Call emergency",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: AlertTriangle,
      title: "Severe Injury",
      symptoms: ["Heavy bleeding", "Fractures", "Head trauma"],
      action: "Apply first aid, call 911",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Seizure",
      symptoms: ["Uncontrolled movements", "Loss of consciousness"],
      action: "Protect from injury, call help",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const quickActions = [
    { icon: Ambulance, label: "Call Ambulance", action: "ambulance" },
    { icon: Phone, label: "Emergency Hotline", action: "hotline" },
    { icon: MapPin, label: "Nearby Hospitals", action: "hospitals" },
    { icon: Users, label: "Emergency Contacts", action: "contacts" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] p-0 gap-0 bg-background">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl sm:text-3xl font-display font-bold flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-destructive to-red-600 flex items-center justify-center shadow-emergency shrink-0">
                  <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="truncate">Emergency Services</span>
              </DialogTitle>
              <p className="text-muted-foreground mt-1 text-sm hidden sm:block">Immediate medical assistance when you need it most</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-80px)] sm:h-[calc(90vh-100px)]">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0" />
              <AlertTitle className="text-destructive font-bold text-sm sm:text-base">Life-Threatening Emergency?</AlertTitle>
              <AlertDescription className="text-foreground text-xs sm:text-sm">
                If you or someone is experiencing a life-threatening emergency, call 911 immediately or go to the nearest emergency room.
              </AlertDescription>
            </Alert>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="emergency"
                    size="lg"
                    className="h-16 sm:h-20 flex-col gap-1 sm:gap-2 text-xs sm:text-sm"
                    onClick={handleEmergencyCall}
                  >
                    <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Common Medical Emergencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {emergencyTypes.map((emergency, index) => (
                  <Card 
                    key={index}
                    className="bg-card border-border/50 hover:border-destructive/50 transition-all"
                  >
                    <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${emergency.color} flex items-center justify-center mb-2 sm:mb-3 shadow-emergency`}>
                        <emergency.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <CardTitle className="text-sm sm:text-base">{emergency.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
                      <div>
                        <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1 uppercase">Symptoms:</p>
                        <ul className="space-y-0.5 sm:space-y-1">
                          {emergency.symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs">
                              <div className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <Badge variant="destructive" className="w-full justify-center text-[10px] sm:text-xs">
                          {emergency.action}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyModal;
