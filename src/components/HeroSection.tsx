import { MessageCircle, Mic, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartChat: () => void;
  onStartVoice: () => void;
}

const HeroSection = ({ onStartChat, onStartVoice }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-success">Because Health Can't Wait</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Your Health,{" "}
          <span className="text-gradient-primary">Always Accessible</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Instant AI-powered medical triage, emergency response, and personalized healthcare at your fingertips.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="xl" onClick={onStartChat} className="w-full sm:w-auto">
            <MessageCircle className="w-5 h-5" />
            Start Chat Consultation
          </Button>
          
          <Button variant="glass" size="xl" onClick={onStartVoice} className="w-full sm:w-auto">
            <Mic className="w-5 h-5" />
            Voice Assistant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="text-center">
            <div className="font-display font-bold text-2xl sm:text-3xl text-primary">{"<"}30s</div>
            <div className="text-sm text-muted-foreground mt-1">Response Time</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-2xl sm:text-3xl text-primary">24/7</div>
            <div className="text-sm text-muted-foreground mt-1">Availability</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-2xl sm:text-3xl text-primary">98%</div>
            <div className="text-sm text-muted-foreground mt-1">Accuracy</div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
