import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import PanicButton from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Phone, 
  Ambulance, 
  AlertTriangle,
  Heart,
  MapPin,
  Clock,
  Users,
  Shield,
  Radio,
  FileText,
  Activity,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const Emergency = () => {
  const handleEmergencyCall = () => {
    toast.error("Emergency Call Initiated", {
      description: "Connecting to emergency services...",
      duration: 3000,
    });
  };

  const handlePanic = () => {
    console.log("Emergency services activated");
  };

  const emergencyTypes = [
    {
      icon: Heart,
      title: "Cardiac Emergency",
      symptoms: ["Chest pain", "Shortness of breath", "Irregular heartbeat"],
      action: "Call 108 immediately",
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
      action: "Apply first aid, call 108",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Seizure",
      symptoms: ["Uncontrolled movements", "Loss of consciousness"],
      action: "Protect from injury, call help",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const emergencySteps = [
    {
      step: "1",
      title: "Assess the Situation",
      description: "Check if the scene is safe and identify the emergency",
      icon: AlertTriangle,
    },
    {
      step: "2",
      title: "Call for Help",
      description: "Dial emergency services immediately (108 in India)",
      icon: Phone,
    },
    {
      step: "3",
      title: "Provide Information",
      description: "Share location, symptoms, and patient condition",
      icon: MapPin,
    },
    {
      step: "4",
      title: "Follow Instructions",
      description: "Listen to emergency dispatcher and provide first aid if trained",
      icon: Shield,
    },
  ];

  const quickActions = [
    { icon: Ambulance, label: "Call Ambulance", action: "ambulance" },
    { icon: Phone, label: "Emergency Hotline", action: "hotline" },
    { icon: MapPin, label: "Nearby Hospitals", action: "hospitals" },
    { icon: Users, label: "Emergency Contacts", action: "contacts" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Emergency Services | Synkcare - Immediate Medical Assistance</title>
        <meta name="description" content="Access emergency medical services, learn about emergency protocols, and get immediate help when you need it most." />
      </Helmet>
      
      <Header />
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
          <Alert className="border-destructive/50 bg-destructive/10 mb-4 sm:mb-6">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0" />
            <AlertTitle className="text-destructive font-bold text-sm sm:text-base">Life-Threatening Emergency?</AlertTitle>
            <AlertDescription className="text-foreground text-xs sm:text-sm">
              If you or someone is experiencing a life-threatening emergency, call 108 immediately or go to the nearest emergency room.
            </AlertDescription>
          </Alert>

          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <Badge variant="destructive" className="mb-2">Emergency Services</Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Immediate Medical
              <span className="text-gradient-primary"> Assistance</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              Quick access to emergency services, protocols, and life-saving information when every second counts.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="emergency"
                size="lg"
                className="h-20 sm:h-24 flex-col gap-1 sm:gap-2 text-xs sm:text-base"
                onClick={handleEmergencyCall}
              >
                <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                {action.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Common Medical Emergencies
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">Recognize symptoms and know when to seek immediate help</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {emergencyTypes.map((emergency, index) => (
              <Card 
                key={index}
                className="bg-card border-border/50 hover:border-destructive/50 transition-all"
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${emergency.color} flex items-center justify-center mb-3 sm:mb-4 shadow-emergency`}>
                    <emergency.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{emergency.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-1 sm:mb-2 uppercase">Symptoms:</p>
                    <ul className="space-y-0.5 sm:space-y-1">
                      {emergency.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                          <div className="w-1 h-1 rounded-full bg-destructive shrink-0" />
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 sm:pt-3 border-t border-border/50">
                    <Badge variant="destructive" className="w-full justify-center text-xs">
                      {emergency.action}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Emergency Response Protocol
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">Follow these steps in case of an emergency</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {emergencySteps.map((item, index) => (
              <div key={index} className="relative">
                <Card className="bg-glass border-border/50 h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-sm sm:text-base text-primary-foreground shadow-glow flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mb-1.5 sm:mb-2" />
                        <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{item.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < emergencySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-primary" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="bg-glass border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-xs sm:text-sm">
                  Our emergency services are available round the clock, every day of the year. No appointment needed.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-glass border-border/50">
              <CardHeader className="p-4 sm:p-6">
                <Radio className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">Real-Time Response</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-xs sm:text-sm">
                  Connected to emergency dispatch centers for immediate response and ambulance coordination.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-glass border-border/50 sm:col-span-2 md:col-span-1">
              <CardHeader className="p-4 sm:p-6">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                <CardTitle className="text-lg sm:text-xl">Medical History Access</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-xs sm:text-sm">
                  Emergency responders can access your medical records for informed treatment decisions.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <PanicButton onActivate={handlePanic} />
    </div>
  );
};

export default Emergency;
