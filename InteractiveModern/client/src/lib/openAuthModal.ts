export function openAuthModal(mode: "login" | "signup" = "login") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("gdg:auth-open", { detail: { mode } }));
}
