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
    <section className="py-12 sm:py-16 px-3 sm:px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-3 sm:mb-4">
            AI-Powered Triage System
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base px-4">
            Our intelligent system evaluates your symptoms and routes you to the appropriate level of care
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.level}
              className={cn(
                "relative p-4 sm:p-6 rounded-xl border bg-card/50 backdrop-blur-sm",
                step.borderColor,
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              )}

              <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4", step.bgColor)}>
                <step.icon className={cn("w-6 h-6 sm:w-7 sm:h-7", step.color)} />
              </div>

              <h3 className={cn("font-display font-bold text-lg sm:text-xl mb-1 sm:mb-2", step.color)}>
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
                {step.description}
              </p>

              <ul className="space-y-1.5 sm:space-y-2">
                {step.actions.map((action) => (
                  <li key={action} className="flex items-center gap-2 text-xs sm:text-sm text-foreground">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", step.bgColor)} />
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
