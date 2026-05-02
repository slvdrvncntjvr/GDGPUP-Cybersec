import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  Crosshair,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: "login" | "signup";
}

export default function AuthModal({
  open,
  onOpenChange,
  defaultMode = "login",
}: AuthModalProps) {
  const { login, register, isLoginPending, isRegisterPending } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    team: "blue" as "blue" | "red",
    rememberMe: false,
  });

  const isLoading = isLoginPending || isRegisterPending;

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setErrorMsg("");
      setFormData({ name: "", email: "", password: "", team: "blue", rememberMe: false });
      setShowPassword(false);
    }
  }, [open]);

  // Sync defaultMode when it changes
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (mode === "login") {
        await login({
          username: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
        toast({ title: "Welcome back! 🎉", description: "You are now logged in." });
      } else {
        await register({
          username: formData.email,
          password: formData.password,
          name: formData.name,
          team: formData.team,
        });
        toast({
          title: "Account created! 🚀",
          description: `Welcome to GDG Cybersec, ${formData.name}!`,
        });
      }
      onOpenChange(false);
    } catch (err: any) {
      // Parse error from server response
      const raw = err?.message ?? "";
      const match = raw.match(/\d+: (.*)/);
      let msg = match ? match[1] : raw;
      try {
        const parsed = JSON.parse(msg);
        msg = parsed?.message ?? msg;
      } catch {}
      setErrorMsg(msg || "Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-card border-border">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyber-blue/5" />

          <div className="relative p-6">
            <DialogHeader className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
              </div>
              <DialogTitle className="font-display text-2xl font-bold text-foreground">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "login"
                  ? "Log in to continue your security journey"
                  : "Join the cybersecurity community"}
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Juan dela Cruz"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      data-testid="input-name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Team selector — sign up only */}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label className="text-sm">Your Team</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["blue", "red"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, team: t })}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border text-sm font-semibold transition-all duration-200",
                          t === "blue"
                            ? formData.team === "blue"
                              ? "border-[hsl(var(--cyber-blue))] bg-[hsl(var(--cyber-blue)/0.1)] text-[hsl(var(--cyber-blue))]"
                              : "border-border text-muted-foreground hover:border-[hsl(var(--cyber-blue)/0.5)]"
                            : formData.team === "red"
                            ? "border-[hsl(var(--cyber-red))] bg-[hsl(var(--cyber-red)/0.1)] text-[hsl(var(--cyber-red))]"
                            : "border-border text-muted-foreground hover:border-[hsl(var(--cyber-red)/0.5)]"
                        )}
                        data-testid={`button-team-${t}`}
                      >
                        {t === "blue" ? (
                          <Shield className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <Crosshair className="w-4 h-4 flex-shrink-0" />
                        )}
                        {t === "blue" ? "Blue Team (Defense)" : "Red Team (Offense)"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                </div>
              )}

              {/* Error message */}
              {errorMsg && (
                <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
                data-testid="button-submit-auth"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Log in" : "Create account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrorMsg(""); }}
                className="text-primary hover:underline font-medium"
                data-testid="button-switch-auth-mode"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
