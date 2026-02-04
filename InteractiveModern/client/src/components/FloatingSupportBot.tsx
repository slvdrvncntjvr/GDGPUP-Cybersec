import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, X, Send, Minimize2, Maximize2, GripVertical } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hey there! I'm your security assistant. I can help you navigate rooms, explain concepts, or give hints on challenges. What would you like to know?",
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
      const responses = [
        "Great question! In cybersecurity, understanding the fundamentals is key. Would you like me to explain more about this topic?",
        "I can help with that! This relates to the room you're in. Try checking the logs for suspicious activity.",
        "That's a common challenge. The hint is to look for privilege escalation vectors - check SUID binaries first!",
        "For blue team defense, start by analyzing the SIEM alerts. Look for patterns in failed login attempts.",
        "Red team tip: Always enumerate thoroughly before exploiting. Information gathering is 80% of the work!",
      ];
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
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
            <Bot className="w-6 h-6" />
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
                  <Bot className="w-4 h-4 text-primary" />
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
