import { MessageCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartChat: () => void;
  onStartVoice: () => void;
}

const HeroSection = ({ onStartChat, onStartVoice }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center px-3 sm:px-4 overflow-hidden pt-6 sm:pt-8">
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/10 border border-success/30 mb-6 sm:mb-8 animate-fade-in mt-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-success">Because Health Can't Wait</span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6 animate-fade-in px-2" style={{ animationDelay: "0.1s" }}>
          Your Health,{" "}
          <span className="text-gradient-primary">Always Accessible</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-lg mx-auto animate-fade-in px-4" style={{ animationDelay: "0.2s" }}>
          Instant AI-powered medical triage, emergency response, and personalized healthcare at your fingertips.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in px-4" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="lg" onClick={onStartChat} className="w-full sm:w-auto">
            <MessageCircle className="w-5 h-5" />
            Start Chat Consultation
          </Button>
          
          <Button variant="glass" size="lg" onClick={onStartVoice} className="w-full sm:w-auto">
            <Mic className="w-5 h-5" />
            Voice Assistant
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="text-center">
            <div className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-primary">{"<"}30s</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Response Time</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-primary">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Availability</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-primary">98%</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Accuracy</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
