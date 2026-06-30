import { useState, useRef, useEffect } from "react";
import { ArrowLeft, MoreVertical, Bot, User, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import UrgencyBadge from "./UrgencyBadge";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  type?: "text" | "report";
  data?: any;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm Synkcare, your AI healthcare assistant. I'm here to help assess your symptoms and connect you with the right care. How are you feeling today?",
    role: "assistant",
    timestamp: "Just now",
  },
];

const cleanDiseaseName = (name?: string) => {
  if (!name) return "";
  return name.replace(/_/g, " ");
};

const MLDiagnosticReport = ({ data, vocab, onRestart }: { data: any; vocab: Record<string, string>; onRestart: () => void }) => {
  const { predictions, recognized_symptoms, warning, disclaimer } = data;

  return (
    <div className="bg-gradient-glass border border-border/80 rounded-2xl p-4 sm:p-5 shadow-glow space-y-4 animate-scale-up max-w-[95%] sm:max-w-[85%] mx-auto my-2">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div>
          <h3 className="font-display font-bold text-sm sm:text-base text-primary">Clinical Diagnostic Report</h3>
          <p className="text-[10px] text-muted-foreground">DDXPlus Mila Machine Learning Engine</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">
          Complete
        </span>
      </div>

      {warning && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-2.5 text-warning text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}

      <div className="space-y-2.5">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Top Pathology Matches</h4>
        <div className="space-y-2.5">
          {predictions.slice(0, 3).map((pred: any) => {
            const getSeverityColor = (sev?: number) => {
              if (!sev) return "bg-muted text-muted-foreground border-border";
              if (sev <= 2) return "bg-destructive/15 text-destructive border-destructive/30";
              if (sev <= 4) return "bg-warning/15 text-warning border-warning/30";
              return "bg-success/15 text-success border-success/30";
            };
            const getSeverityLabel = (sev?: number) => {
              if (!sev) return "Unknown";
              if (sev <= 2) return "High Risk";
              if (sev <= 4) return "Moderate Risk";
              return "Low Risk";
            };

            return (
              <div key={pred.disease} className="space-y-1 bg-card/65 border border-border/40 rounded-xl p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-foreground">{cleanDiseaseName(pred.disease)}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded-full border ${getSeverityColor(pred.severity)}`}>
                      {getSeverityLabel(pred.severity)}
                    </span>
                    <span className="text-xs font-mono font-bold text-primary">
                      {Math.round(pred.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-primary h-full transition-all duration-500"
                    style={{ width: `${pred.confidence * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {recognized_symptoms && recognized_symptoms.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Present Evidence</h4>
          <div className="flex flex-wrap gap-1">
            {recognized_symptoms.map((sym: string) => (
              <span key={sym} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-secondary-foreground font-medium">
                {vocab[sym] || cleanDiseaseName(sym)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-[9px] text-muted-foreground/70 leading-relaxed border-t border-border/50 pt-2.5 italic">
        {disclaimer}
      </div>

      <div className="flex justify-center pt-1.5">
        <Button size="sm" onClick={onRestart} className="rounded-full text-xs px-4 py-1.5 h-8">
          Restart ML Diagnosis
        </Button>
      </div>
    </div>
  );
};

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [urgencyLevel, setUrgencyLevel] = useState<"normal" | "urgent" | "critical">("normal");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ML Mode States
  const [mode, setMode] = useState<"ai" | "ml">("ai");
  const [mlSymptoms, setMlSymptoms] = useState<string[]>([]);
  const [mlExcludedSymptoms, setMlExcludedSymptoms] = useState<string[]>([]);
  const [mlQuestionHistory, setMlQuestionHistory] = useState<string[]>([]);
  const [mlFollowUp, setMlFollowUp] = useState<any>(null);
  const [symptomVocab, setSymptomVocab] = useState<Record<string, string>>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch symptom vocabulary on mount
  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const response = await fetch('/api/disease/symptoms');
        if (response.ok) {
          const data = await response.json();
          const vocabMap: Record<string, string> = {};
          data.symptoms.forEach((sym: { key: string; question: string }) => {
            let label = sym.question
              .replace(/^Do you have (a |an )?/i, '')
              .replace(/^Are you experiencing (a |an )?/i, '')
              .replace(/\?$/, '')
              .trim();
            label = label.charAt(0).toUpperCase() + label.slice(1);
            vocabMap[sym.key] = label;
          });
          setSymptomVocab(vocabMap);
        }
      } catch (err) {
        console.error('Failed to load symptoms vocabulary:', err);
      }
    };
    fetchVocab();
  }, []);

  const handleModeChange = (newMode: "ai" | "ml") => {
    if (newMode === mode) return;
    setMode(newMode);

    if (newMode === "ai") {
      setMessages(initialMessages);
      setUrgencyLevel("normal");
    } else {
      setMessages([
        {
          id: "ml-start",
          content: "Hello! I am Synkcare's Advanced ML Diagnostic engine. I use the Mila/DDXPlus Random Forest model (98.5% accuracy) to perform diagnostic triage.\n\nTo begin, please describe the symptoms you are currently experiencing in plain English (e.g. 'I have a high fever, a dry cough, and shortness of breath').",
          role: "assistant",
          timestamp: "Just now",
        }
      ]);
      setMlSymptoms([]);
      setMlExcludedSymptoms([]);
      setMlQuestionHistory([]);
      setMlFollowUp(null);
      setUrgencyLevel("normal");
    }
  };

  const handleRestartMl = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hello! I am Synkcare's Advanced ML Diagnostic engine.\n\nTo begin, please describe the symptoms you are currently experiencing in plain English (e.g. 'I have a high fever, a dry cough, and shortness of breath').",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    ]);
    setMlSymptoms([]);
    setMlExcludedSymptoms([]);
    setMlQuestionHistory([]);
    setMlFollowUp(null);
    setUrgencyLevel("normal");
  };

  const runMlPrediction = async (symptomsList: string[], excludedList: string[]) => {
    setIsTyping(true);
    try {
      const predRes = await fetch('/api/disease/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsList,
          exclude_symptoms: excludedList,
          top_k: 3
        })
      });

      if (!predRes.ok) throw new Error("Prediction failed");

      const predData = await predRes.json();

      if (predData.predictions && predData.predictions.length > 0) {
        const topSev = predData.predictions[0].severity;
        if (topSev <= 2) setUrgencyLevel("critical");
        else if (topSev <= 4) setUrgencyLevel("urgent");
        else setUrgencyLevel("normal");
      }

      if (predData.diagnosis_available) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: "",
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "report",
          data: predData
        }]);
        setMlFollowUp(null);
      } else {
        if (predData.follow_up_question) {
          setMlFollowUp(predData.follow_up_question);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: predData.follow_up_question.question,
            role: "assistant",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }]);
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: "",
            role: "assistant",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "report",
            data: predData
          }]);
          setMlFollowUp(null);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "I'm having trouble communicating with the ML engine right now. Please try again.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMlAnswer = async (ans: boolean) => {
    if (!mlFollowUp) return;

    const userMsgText = ans ? "Yes" : "No";
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: userMsgText,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);

    const targetKey = mlFollowUp.symptom_key;
    const newSymptoms = ans ? [...mlSymptoms, targetKey] : mlSymptoms;
    const newExcluded = ans ? mlExcludedSymptoms : [...mlExcludedSymptoms, targetKey];

    setMlSymptoms(newSymptoms);
    setMlExcludedSymptoms(newExcluded);
    setMlQuestionHistory(prev => [...prev, targetKey]);

    setMlFollowUp(null); // Clear active question to trigger typing
    await runMlPrediction(newSymptoms, newExcluded);
  };

  const handleMlSkip = async () => {
    if (!mlFollowUp) return;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: "Skip",
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);

    const targetKey = mlFollowUp.symptom_key;
    const newExcluded = [...mlExcludedSymptoms, targetKey];

    setMlExcludedSymptoms(newExcluded);
    setMlQuestionHistory(prev => [...prev, targetKey]);

    setMlFollowUp(null);
    await runMlPrediction(mlSymptoms, newExcluded);
  };

  const handleMlForceDiagnose = async () => {
    setMlFollowUp(null);
    setIsTyping(true);
    try {
      const predRes = await fetch('/api/disease/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: mlSymptoms,
          exclude_symptoms: mlExcludedSymptoms,
          top_k: 3
        })
      });

      if (!predRes.ok) throw new Error("Prediction failed");
      const predData = await predRes.json();

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: "",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "report",
        data: predData
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (content: string) => {
    if (mode === "ml") {
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const extractRes = await fetch('/api/disease/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: content })
        });

        if (!extractRes.ok) throw new Error("Failed to extract symptoms");

        const extractData = await extractRes.json();
        const extractedKeys = extractData.symptoms || [];

        if (extractedKeys.length === 0) {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            content: "I couldn't identify any clinical symptoms in your text. Could you try describing your symptoms again using other words? (e.g. 'I have a high fever and runny nose')",
            role: "assistant",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }]);
          return;
        }

        const recognizedNames = extractedKeys.map((k: string) => symptomVocab[k] || cleanDiseaseName(k));
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: `I've recognized the following symptom(s): **${recognizedNames.join(', ')}**. Let me initialize the DDXPlus ML Diagnostic loop...`,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);

        setMlSymptoms(extractedKeys);
        await runMlPrediction(extractedKeys, []);
      } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: "Failed to load prediction engine. Please verify the ML service is online.",
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);
        setIsTyping(false);
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      setUrgencyLevel(data.urgency);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. If you're experiencing a medical emergency, please call emergency services immediately.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pt-16">
      {/* Top Header */}
      <div className="bg-glass border-b border-border/50 px-3 sm:px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="min-w-0">
            <h2 className="font-display font-semibold text-foreground truncate">
              {mode === "ml" ? "DDXPlus Diagnostic Engine" : "Synkcare AI"}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success shrink-0" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <UrgencyBadge level={urgencyLevel} className="hidden xs:flex" />
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-2 py-2 bg-muted/20 border-b border-border/40 shrink-0">
        <Button
          variant={mode === "ai" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleModeChange("ai")}
          className="rounded-full text-xs font-semibold px-4 h-7"
        >
          Synkcare AI Chat
        </Button>
        <Button
          variant={mode === "ml" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleModeChange("ml")}
          className="rounded-full text-xs font-semibold px-4 h-7"
        >
          DDXPlus ML Diagnosis
        </Button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => {
          if (message.type === "report") {
            return (
              <MLDiagnosticReport
                key={message.id}
                data={message.data}
                vocab={symptomVocab}
                onRestart={handleRestartMl}
              />
            );
          }
          return (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
            />
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>Analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar or Interactive Choice buttons */}
      <div className="p-3 sm:p-4 shrink-0 bg-card/25 border-t border-border/50">
        {mode === "ml" && mlFollowUp ? (
          <div className="flex flex-col gap-2.5 py-1.5 animate-fade-in">
            <p className="text-[11px] text-muted-foreground text-center font-medium">
              ML Follow-up Question to differentiate: <span className="text-primary font-semibold">{cleanDiseaseName(mlFollowUp.asked_to_help_distinguish)}</span>
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="hero"
                onClick={() => handleMlAnswer(true)}
                disabled={isTyping}
                className="flex-1 max-w-[110px] h-9 text-xs"
              >
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={() => handleMlAnswer(false)}
                disabled={isTyping}
                className="flex-1 max-w-[110px] h-9 text-xs bg-background"
              >
                No
              </Button>
              <Button
                variant="ghost"
                onClick={handleMlSkip}
                disabled={isTyping}
                className="flex-1 max-w-[110px] h-9 text-xs"
              >
                Skip
              </Button>
            </div>
            {mlSymptoms.length >= 2 && (
              <Button
                variant="link"
                size="sm"
                onClick={handleMlForceDiagnose}
                disabled={isTyping}
                className="text-[10px] text-muted-foreground hover:text-foreground self-center h-6"
              >
                Stop asking & generate best match
              </Button>
            )}
          </div>
        ) : (
          <ChatInput
            onSend={handleSend}
            disabled={isTyping}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
