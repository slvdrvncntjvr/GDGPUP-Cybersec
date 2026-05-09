import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X, Send, Minimize2, Maximize2, GripVertical } from "lucide-react";
import logo from "./GDGCybersec-Assets/sparky_head.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Deterministic FAQ. We are upfront that this is NOT an LLM — it pattern-matches
// against the most common questions we see in the GDG Cybersec track.
interface FaqEntry {
  matches: RegExp;
  answer: string;
}

const FAQ: FaqEntry[] = [
  {
    matches: /\b(team[\s_-]?id|teamid)\b/i,
    answer:
      "Your TEAM_ID is shown on your profile page (Dashboard → Profile). It's the value substituted into every NEXUS{...} flag — for example NEXUS{SQLI_ADMIN_TEAM05}. Click the badge on your profile to copy it.",
  },
  {
    matches: /\b(flag|nexus|format|submit)\b/i,
    answer:
      "Flags follow the pattern NEXUS{<CHALLENGE>_<TEAM_ID>}. Submit them on the room's Challenges tab. Capitalisation matters; whitespace is trimmed for you.",
  },
  {
    matches: /\b(red|red[\s-]?team|offens(e|ive))\b/i,
    answer:
      "RED-1..4 cover offensive labs: Web Exploit, Advanced Web, Cloud Attacks, and Post-Exploitation. Start with RED-1 (OWASP Juice Shop).",
  },
  {
    matches: /\b(blue|blue[\s-]?team|defens(e|ive))\b/i,
    answer:
      "BLUE-1..4 cover defensive labs: Hardening, Packet Analysis, IDS/SIEM, and Incident Response + Cloud Defense. Start with BLUE-1.",
  },
  {
    matches: /\b(juice[\s-]?shop|owasp)\b/i,
    answer:
      "We use OWASP Juice Shop as the RED-1 target. Hosted instances: https://juice-shop.herokuapp.com or https://demo.owasp-juice.shop. RED-1 walks you through SQLi, XSS, and password-reset abuse.",
  },
  {
    matches: /\b(xp|points|score)\b/i,
    answer:
      "Each challenge awards a fixed amount of XP (15–60). XP is awarded only on the FIRST successful solve — repeated submissions log an attempt without doubling.",
  },
  {
    matches: /\b(login|logout|account|register|sign[\s-]?up)\b/i,
    answer:
      "Use the Sign In / Sign Up button in the top nav. After logging in, your TEAM_ID becomes available on the dashboard and the Rooms page.",
  },
];

const FALLBACK_ANSWER =
  "I'm a static FAQ helper, not an LLM. Try asking about: TEAM_ID, flag format, NEXUS, RED-1..4, BLUE-1..4, XP, or login. For anything else, ping the Discord linked in the community page.";

function answerFor(question: string): string {
  for (const entry of FAQ) {
    if (entry.matches.test(question)) {
      return entry.answer;
    }
  }
  return FALLBACK_ANSWER;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi — I'm a static help bot (no LLM behind the curtain). Ask me about TEAM_ID, flag format, NEXUS, room codes, XP, or login.",
  },
];

export default function FloatingSupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("supportbot-position");
    if (saved) {
      try {
        setPosition(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("supportbot-position", JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    const newX = Math.max(0, Math.min(window.innerWidth - 80, dragRef.current.initialX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, dragRef.current.initialY + dy));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: answerFor(userMessage.content),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 400);
  };

  return ( 
    <>  
      <style>{`
        @keyframes botPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
        }
        @keyframes botFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .bot-button {
          animation: botPulse 2s infinite, botFloat 3s ease-in-out infinite;
        }
        .bot-button:hover {
          animation: none;
          transform: scale(1.1);
        }
      `}</style>

      <div
        ref={containerRef}
        className="fixed z-50"
        style={{
          right: position.x,
          bottom: position.y,
          cursor: isDragging ? "grabbing" : "default",
        }}
        data-testid="floating-support-bot"
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="bot-button w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 transition-transform"
            data-testid="button-open-support-bot"
          >
            <img
              src={logo}
              alt='Chat Support'
              className="w-8 h-8 object-contain"
            />
          </button>
        ) : (
          <div
            className={cn(
              "bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300",
              isMinimized ? "w-64 h-14" : "w-80 sm:w-96 h-[450px]"
            )}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border cursor-grab">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <img
                    src={logo}
                    alt='bot'
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Support Assistant</p>
                  {!isMinimized && (
                    <p className="text-xs text-muted-foreground">Here to help</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1" data-no-drag>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => setIsMinimized(!isMinimized)}
                  data-testid="button-minimize-bot"
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-close-bot"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <ScrollArea className="h-[340px] p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t border-border" data-no-drag>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1"
                      data-testid="input-support-message"
                    />
                    <Button type="submit" size="icon" data-testid="button-send-support-message">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
