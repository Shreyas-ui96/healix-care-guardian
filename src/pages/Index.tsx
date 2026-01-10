import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import TriageFlow from "@/components/TriageFlow";
import ChatInterface from "@/components/ChatInterface";
import PanicButton from "@/components/PanicButton";
import EmergencyModal from "@/components/EmergencyModal";
import { toast } from "sonner";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    let animationFrameId: number;
    let resizeHandler: () => void;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const getDimensions = () => ({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      });

      let { width, height } = getDimensions();
      const NUM_PARTICLES = 200;
      const GLOW_COLOR = "rgba(42, 178, 145, 1)";
      const PARTICLE_COLOR = "rgba(42, 178, 145, 0.8)";

      class Particle {
        x: number;
        y: number;
        radius: number;
        vx: number;
        vy: number;

        constructor() {
          this.x = 0;
          this.y = 0;
          this.radius = 0;
          this.vx = 0;
          this.vy = 0;
          this.reset();
        }

        reset() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.radius = Math.random() * 2.5 + 1.5;
          this.vx = (Math.random() - 0.5) * 0.2;
          this.vy = (Math.random() - 0.5) * 0.2;
        }

        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
          if (!ctx) return;
          
          // Create radial gradient for perfect sphere effect
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
          );
          gradient.addColorStop(0, PARTICLE_COLOR);
          gradient.addColorStop(0.7, PARTICLE_COLOR);
          gradient.addColorStop(1, "rgba(42, 178, 145, 0)");
          
          // Draw glow
          ctx.beginPath();
          ctx.shadowBlur = this.radius * 20;
          ctx.shadowColor = GLOW_COLOR;
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      let particles: Particle[] = [];
      
      const initParticles = () => {
        canvas.width = width;
        canvas.height = height;
        particles = Array.from({ length: NUM_PARTICLES }, () => new Particle());
      };

      const animateParticles = () => {
        animationFrameId = requestAnimationFrame(animateParticles);
        ctx.fillStyle = "#0d0a10";
        ctx.fillRect(0, 0, width, height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      };

      resizeHandler = () => {
        const dims = getDimensions();
        width = dims.width;
        height = dims.height;
        canvas.width = width;
        canvas.height = height;
        initParticles();
      };

      window.addEventListener("resize", resizeHandler);
      initParticles();
      animateParticles();
    }

    return () => {
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
        <Header onEmergencyClick={() => setShowEmergency(true)} />
        <ChatInterface onBack={() => setShowChat(false)} />
        <PanicButton onActivate={handlePanic} onEmergencyClick={() => setShowEmergency(true)} />
        <EmergencyModal open={showEmergency} onOpenChange={setShowEmergency} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Particle Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      
      <Helmet>
        <title>Healix - 24/7 AI-Powered Healthcare Assistant</title>
        <meta 
          name="description" 
          content="Healix is your 24/7 AI healthcare assistant providing instant medical triage, emergency response, telemedicine, and personalized healthcare services." 
        />
        <meta name="keywords" content="healthcare, AI assistant, medical triage, telemedicine, emergency response, digital health" />
      </Helmet>

      <div className="relative z-10">
        <Header onEmergencyClick={() => setShowEmergency(true)} />
        
        <main className="pt-16">
        <HeroSection 
          onStartChat={handleStartChat} 
          onStartVoice={handleStartVoice} 
        />
        
        <TriageFlow />
        
        <ServicesSection />
        
        {/* Emergency Response Protocol */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Emergency Response Protocol
              </h2>
              <p className="text-muted-foreground">Follow these steps in case of an emergency</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Assess the Situation",
                  description: "Check if the scene is safe and identify the emergency",
                  icon: "⚠️",
                },
                {
                  step: "2",
                  title: "Call for Help",
                  description: "Dial emergency services immediately (911 in US)",
                  icon: "📞",
                },
                {
                  step: "3",
                  title: "Provide Information",
                  description: "Share location, symptoms, and patient condition",
                  icon: "📍",
                },
                {
                  step: "4",
                  title: "Follow Instructions",
                  description: "Listen to emergency dispatcher and provide first aid if trained",
                  icon: "🛡️",
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-glass border border-border/50 rounded-lg p-6 h-full hover:border-primary/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-primary-foreground shadow-glow flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Emergency Services Information
              </h2>
              <p className="text-muted-foreground">Always available when you need us most</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-glass border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-all">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-semibold text-xl mb-2">24/7 Availability</h3>
                <p className="text-muted-foreground">
                  Our emergency services are available round the clock, every day of the year. No appointment needed.
                </p>
              </div>

              <div className="bg-glass border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-all">
                <div className="text-4xl mb-4">📡</div>
                <h3 className="font-semibold text-xl mb-2">Real-Time Response</h3>
                <p className="text-muted-foreground">
                  Connected to emergency dispatch centers for immediate response and ambulance coordination.
                </p>
              </div>

              <div className="bg-glass border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-all">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="font-semibold text-xl mb-2">Medical History Access</h3>
                <p className="text-muted-foreground">
                  Emergency responders can access your medical records for informed treatment decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-4 border-t border-border">
          <div className="container mx-auto max-w-6xl text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Healix. Your health, always accessible. For emergencies, always dial local emergency services.
            </p>
          </div>
        </footer>
      </main>
      </div>

      <PanicButton onActivate={handlePanic} onEmergencyClick={() => setShowEmergency(true)} />
      <EmergencyModal open={showEmergency} onOpenChange={setShowEmergency} />
    </div>
  );
};

export default Index;
