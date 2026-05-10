import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import logo from "./GDGCybersec-Assets/sparky_head.png";
import { apiRequest } from "@/lib/queryClient";
import { answerFromFaq } from "@shared/supportFaq";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface SupportChatResponse {
  source: "gemini" | "faq" | "error" | "ratelimit";
  answer: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hey there! Ask me about TEAM_ID, NEXUS flag format, room codes, XP, or login.",
  },
];

const PANEL_WIDTH = 384; // matches sm:w-96
const PANEL_HEIGHT = 460;
const LAUNCHER_SIZE = 56;
const EDGE_PADDING = 16;

/**
 * Position is the offset from the bottom-right corner (in CSS `right` / `bottom`).
 * Dragging math therefore needs to *invert* dx/dy: moving the mouse right
 * should decrease `right`, not increase it.
 */
interface BotPosition {
  x: number;
  y: number;
}

const DEFAULT_POSITION: BotPosition = { x: EDGE_PADDING, y: EDGE_PADDING };

function clampPosition(
  pos: BotPosition,
  panelWidth: number,
  panelHeight: number
): BotPosition {
  if (typeof window === "undefined") return pos;
  const maxX = Math.max(0, window.innerWidth - panelWidth - EDGE_PADDING);
  const maxY = Math.max(0, window.innerHeight - panelHeight - EDGE_PADDING);
  return {
    x: Math.max(0, Math.min(maxX, pos.x)),
    y: Math.max(0, Math.min(maxY, pos.y)),
  };
}

export default function FloatingSupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState<BotPosition>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const panelWidth = isOpen
    ? isMinimized
      ? 256
      : PANEL_WIDTH
    : LAUNCHER_SIZE;
  const panelHeight = isOpen
    ? isMinimized
      ? 56
      : PANEL_HEIGHT
    : LAUNCHER_SIZE;

  // Restore saved position on mount, clamped to current viewport.
  useEffect(() => {
    const saved = localStorage.getItem("supportbot-position");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as BotPosition;
      setPosition(clampPosition(parsed, PANEL_WIDTH, PANEL_HEIGHT));
    } catch {
      // ignore malformed cache
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("supportbot-position", JSON.stringify(position));
  }, [position]);

  // Keep the bot on screen if the user resizes the window.
  useEffect(() => {
    const onResize = () =>
      setPosition((p) => clampPosition(p, panelWidth, panelHeight));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [panelWidth, panelHeight]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      // Anchored to bottom-right: dragging right (dx>0) should *decrease*
      // the `right` offset so the panel actually follows the cursor.
      const next = clampPosition(
        {
          x: dragRef.current.initialX - dx,
          y: dragRef.current.initialY - dy,
        },
        panelWidth,
        panelHeight
      );
      setPosition(next);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, panelWidth, panelHeight]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setIsTyping(true);

    const trimmedHistory = nextHistory.slice(-9, -1).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await apiRequest("POST", "/api/support/chat", {
        message: userMessage.content,
        history: trimmedHistory,
      });
      const data = (await res.json()) as SupportChatResponse;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: answerFromFaq(userMessage.content),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
          transform: scale(1.08);
        }
      `}</style>

      <div
        ref={containerRef}
        className="fixed z-50 select-none"
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
            aria-label="Open support assistant"
          >
            <img
              src={logo}
              alt="Chat Support"
              className="w-8 h-8 object-contain"
            />
          </button>
        ) : (
          <div
            className={cn(
              "bg-card/95 backdrop-blur-sm border border-border/80 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden transition-all duration-200",
              isMinimized ? "w-64 h-14" : "w-80 sm:w-96 h-[460px] flex flex-col"
            )}
          >
            {/* Header — drag handle */}
            <div
              className={cn(
                "flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-border/60",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/20">
                  <img
                    src={logo}
                    alt="bot"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    Support Assistant
                  </p>
                  {!isMinimized && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Online
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5" data-no-drag>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => setIsMinimized(!isMinimized)}
                  data-testid="button-minimize-bot"
                  aria-label={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Minimize2 className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-close-bot"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <ScrollArea className="flex-1" ref={scrollRef}>
                  <div className="p-4 space-y-3">
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
                            "max-w-[88%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted/70 text-foreground rounded-bl-md"
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted/70 rounded-2xl rounded-bl-md px-4 py-2.5">
                          <div className="flex gap-1">
                            <span
                              className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-3 border-t border-border/60" data-no-drag>
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
                      className="flex-1 h-9"
                      data-testid="input-support-message"
                      disabled={isTyping}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="h-9 w-9"
                      disabled={isTyping || !input.trim()}
                      data-testid="button-send-support-message"
                      aria-label="Send"
                    >
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
