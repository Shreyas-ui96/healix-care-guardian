import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import TriageFlow from "@/components/TriageFlow";
import ChatInterface from "@/components/ChatInterface";
import PanicButton from "@/components/PanicButton";
import { toast } from "sonner";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
  };

  const handleStartVoice = () => {
    toast.info("Voice Assistant", {
      description: "Voice interaction coming soon. Please use chat for now.",
    });
  };

  const handlePanic = () => {
    // In production, this would trigger real emergency services
    console.log("Emergency services activated");
  };

  if (showChat) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Chat Consultation | Healix - AI Healthcare Assistant</title>
          <meta name="description" content="Chat with Healix AI for instant medical symptom assessment and healthcare guidance." />
        </Helmet>
        <Header />
        <ChatInterface onBack={() => setShowChat(false)} />
        <PanicButton onActivate={handlePanic} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Healix - 24/7 AI-Powered Healthcare Assistant</title>
        <meta 
          name="description" 
          content="Healix is your 24/7 AI healthcare assistant providing instant medical triage, emergency response, telemedicine, and personalized healthcare services." 
        />
        <meta name="keywords" content="healthcare, AI assistant, medical triage, telemedicine, emergency response, digital health" />
      </Helmet>

      <Header />
      
      <main className="pt-16">
        <HeroSection 
          onStartChat={handleStartChat} 
          onStartVoice={handleStartVoice} 
        />
        
        <TriageFlow />
        
        <ServicesSection />
        
        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto max-w-6xl text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Healix. Your health, always accessible. For emergencies, always dial local emergency services.
            </p>
          </div>
        </footer>
      </main>

      <PanicButton onActivate={handlePanic} />
    </div>
  );
};

export default Index;
