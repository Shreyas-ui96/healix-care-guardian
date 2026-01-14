import { Video, Home, Pill, Ambulance, FileText, Bell } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { toast } from "sonner";

const ServicesSection = () => {
  const handleServiceClick = (service: string) => {
    toast.success(`${service} initiated`, {
      description: "Connecting you with the right care...",
    });
  };

  return (
    <section className="py-12 sm:py-16 px-3 sm:px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-3 sm:mb-4">
            Healthcare Services
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base px-4">
            Choose from our range of healthcare services tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ServiceCard
            icon={Video}
            title="Video Consultation"
            description="Instant video call with certified doctors. Available 24/7 for immediate medical advice."
            urgency="normal"
            onClick={() => handleServiceClick("Video consultation")}
          />
          
          <ServiceCard
            icon={Home}
            title="Home Visit"
            description="Doctor or nurse visit to your location. Professional care in the comfort of your home."
            urgency="normal"
            onClick={() => handleServiceClick("Home visit booking")}
          />
          
          <ServiceCard
            icon={Pill}
            title="Medicine Delivery"
            description="Get prescribed medications delivered to your doorstep within hours."
            urgency="normal"
            onClick={() => handleServiceClick("Medicine delivery")}
          />
          
          <ServiceCard
            icon={Ambulance}
            title="Emergency Response"
            description="Instant ambulance dispatch with real-time tracking and traffic-aware routing."
            urgency="critical"
            onClick={() => handleServiceClick("Emergency response")}
          />
          
          <ServiceCard
            icon={FileText}
            title="Digital Records"
            description="Access your complete medical history, prescriptions, and lab results anytime."
            urgency="normal"
            onClick={() => handleServiceClick("Health records access")}
          />
          
          <ServiceCard
            icon={Bell}
            title="Follow-up Care"
            description="Automated reminders for medications, checkups, and recovery tracking."
            urgency="normal"
            onClick={() => handleServiceClick("Follow-up reminders")}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
