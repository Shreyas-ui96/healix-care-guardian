import { CheckCircle, AlertTriangle, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TriageFlow = () => {
  const steps = [
    {
      level: "normal",
      icon: CheckCircle,
      title: "Normal",
      description: "Non-urgent symptoms",
      actions: ["Schedule consultation", "Order medicine", "Book home visit"],
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/30",
    },
    {
      level: "urgent",
      icon: AlertTriangle,
      title: "Urgent",
      description: "Requires prompt attention",
      actions: ["Instant video call", "Priority home visit", "Specialist referral"],
      color: "text-urgent",
      bgColor: "bg-urgent/10",
      borderColor: "border-urgent/30",
    },
    {
      level: "critical",
      icon: AlertCircle,
      title: "Critical",
      description: "Emergency response",
      actions: ["Ambulance dispatch", "Emergency helpline", "Surgeon dispatch"],
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-card">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
            AI-Powered Triage System
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Our intelligent system evaluates your symptoms and routes you to the appropriate level of care
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.level}
              className={cn(
                "relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm",
                step.borderColor,
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              )}

              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-4", step.bgColor)}>
                <step.icon className={cn("w-7 h-7", step.color)} />
              </div>

              <h3 className={cn("font-display font-bold text-xl mb-2", step.color)}>
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4">
                {step.description}
              </p>

              <ul className="space-y-2">
                {step.actions.map((action) => (
                  <li key={action} className="flex items-center gap-2 text-sm text-foreground">
                    <span className={cn("w-1.5 h-1.5 rounded-full", step.bgColor)} />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TriageFlow;
