import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PublicUser } from "@shared/schema";

// ─── Fetch current user ───────────────────────────────────────────────────────

async function fetchMe(): Promise<PublicUser | null> {
  const res = await fetch("/api/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  return res.json();
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const qc = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/me"],
    queryFn: fetchMe,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
  });

  const loginMut = useMutation({
    mutationFn: async (creds: { username: string; password: string; rememberMe?: boolean }) => {
      const res = await apiRequest("POST", "/api/login", creds);
      return res.json() as Promise<PublicUser>;
    },
    onSuccess: (user) => {
      qc.setQueryData(["/api/me"], user);
    },
  });

  const registerMut = useMutation({
    mutationFn: async (data: {
      username: string;
      password: string;
      name: string;
      team: "blue" | "red";
    }) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json() as Promise<PublicUser>;
    },
    onSuccess: (user) => {
      qc.setQueryData(["/api/me"], user);
      qc.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  const logoutMut = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      qc.setQueryData(["/api/me"], null);
      qc.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  return {
    user: user ?? null,
    isLoggedIn: !!user,
    isLoading,

    login: loginMut.mutateAsync,
    loginError: loginMut.error,
    isLoginPending: loginMut.isPending,

    register: registerMut.mutateAsync,
    registerError: registerMut.error,
    isRegisterPending: registerMut.isPending,

    logout: logoutMut.mutateAsync,
    isLogoutPending: logoutMut.isPending,
  };
}
