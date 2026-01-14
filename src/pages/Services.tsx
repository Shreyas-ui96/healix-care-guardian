import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import PanicButton from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Video, 
  Stethoscope, 
  FileText, 
  Calendar, 
  Heart,
  Activity,
  Brain,
  Baby,
  Pill,
  ShieldCheck,
  Clock
} from "lucide-react";

const Services = () => {
  const handlePanic = () => {
    console.log("Emergency services activated");
  };

  const services = [
    {
      icon: MessageSquare,
      title: "AI Chat Consultation",
      description: "24/7 instant medical advice through our intelligent AI assistant",
      features: ["Symptom assessment", "Medical guidance", "Instant responses"],
      price: "Free",
      color: "from-primary to-teal-400",
    },
    {
      icon: Video,
      title: "Video Consultation",
      description: "Connect with certified doctors via secure video calls",
      features: ["Real-time consultation", "Prescription delivery", "Follow-up care"],
      price: "$49/session",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Stethoscope,
      title: "Specialist Care",
      description: "Access to specialized medical professionals for specific health needs",
      features: ["Cardiology", "Dermatology", "Psychiatry", "More specialties"],
      price: "$89/session",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Book appointments with healthcare providers at your convenience",
      features: ["Flexible timing", "Automated reminders", "Easy rescheduling"],
      price: "Free",
      color: "from-orange-500 to-red-400",
    },
    {
      icon: FileText,
      title: "Health Records",
      description: "Secure digital storage of your complete medical history",
      features: ["Cloud storage", "Easy sharing", "Data encryption"],
      price: "Free",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: Activity,
      title: "Health Monitoring",
      description: "Track vital signs and health metrics in real-time",
      features: ["Wearable integration", "Trend analysis", "Alert system"],
      price: "$19/month",
      color: "from-indigo-500 to-blue-400",
    },
  ];

  const specializedServices = [
    { icon: Heart, title: "Cardiology", desc: "Heart health specialists" },
    { icon: Brain, title: "Neurology", desc: "Brain & nervous system" },
    { icon: Baby, title: "Pediatrics", desc: "Child healthcare" },
    { icon: Pill, title: "Pharmacy", desc: "Prescription delivery" },
    { icon: ShieldCheck, title: "Preventive Care", desc: "Health screening" },
    { icon: Clock, title: "24/7 Emergency", desc: "Round-the-clock support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Our Services | Healix - Comprehensive Healthcare Solutions</title>
        <meta name="description" content="Explore Healix's comprehensive healthcare services including AI consultations, video calls, specialist care, and health monitoring." />
      </Helmet>
      
      <Header />
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <section className="container mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <Badge variant="outline" className="mb-2">Our Services</Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Comprehensive Healthcare
              <span className="text-gradient-primary"> At Your Fingertips</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground px-4">
              From AI-powered consultations to specialist care, we provide everything you need for your health and wellness journey.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="bg-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-card group"
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-glow`}>
                    <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-sm">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  <ul className="space-y-1.5 sm:space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/50">
                    <span className="font-semibold text-base sm:text-lg text-primary">{service.price}</span>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Specialized Medical Services
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">Expert care across multiple medical specialties</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {specializedServices.map((service, index) => (
              <Card 
                key={index}
                className="bg-glass border-border/50 hover:border-primary/50 transition-all cursor-pointer group text-center p-4 sm:p-6"
              >
                <service.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-xs sm:text-sm mb-1">{service.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{service.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4">
          <Card className="bg-gradient-to-br from-primary/10 to-teal-500/10 border-primary/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/5 rounded-full blur-3xl" />
            <CardContent className="p-6 sm:p-8 md:p-12 text-center relative z-10">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Ready to Experience Better Healthcare?
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
                Join thousands of users who trust Healix for their healthcare needs. Get started today with a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button variant="hero" size="lg" className="gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Start Free Consultation
                </Button>
                <Button variant="outline" size="lg">
                  View Pricing Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <PanicButton onActivate={handlePanic} />
    </div>
  );
};

export default Services;
