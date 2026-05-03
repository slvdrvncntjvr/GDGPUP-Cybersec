export function openAuthModal(mode: "login" | "signup" = "login", returnTo?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("gdg:auth-open", { detail: { mode, returnTo } }));
}
