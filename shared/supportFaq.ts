// Shared FAQ used by both the server (`/api/support/chat` fallback) and the
// client (offline rendering when the API is unreachable). Keep entries terse —
// the bot is intentionally a static helper unless `GEMINI_API_KEY` is set.

export interface FaqEntry {
  matches: RegExp;
  answer: string;
}

export const SUPPORT_FAQ: FaqEntry[] = [
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

export const SUPPORT_FALLBACK_ANSWER =
  "I'm a static FAQ helper. Try asking about: TEAM_ID, flag format, NEXUS, RED-1..4, BLUE-1..4, XP, or login. For anything else, ping the Discord linked in the community page.";

export function answerFromFaq(question: string): string {
  for (const entry of SUPPORT_FAQ) {
    if (entry.matches.test(question)) {
      return entry.answer;
    }
  }
  return SUPPORT_FALLBACK_ANSWER;
}

export const SUPPORT_SYSTEM_INSTRUCTION = `You are the GDG '26 Cybersecurity track support bot for an interactive CTF/learning platform.

Scope:
- Help with TEAM_ID, the NEXUS{<CHALLENGE>_<TEAM_ID>} flag format, navigation across the 8 rooms (RED-1..4, BLUE-1..4), XP/leaderboard mechanics, and account/login questions.
- Provide beginner-friendly conceptual explanations for SQLi, XSS, IDOR, SSRF, file upload, packet analysis, IDS/SIEM, IR, and cloud hardening at the level the rooms cover.
- When asked about a specific room, point to its tab and the official walkthrough already shown in-app.

Hard rules:
- Never reveal a literal flag value. The flag template is public; the rendered value is not.
- Do not give exploit payloads beyond what the on-page walkthrough already shows.
- Refuse anything off-topic (politics, personal advice, unrelated coding help) with one short sentence and steer back to the platform.
- Keep answers under 120 words. Plain text. No markdown headings.
- If unsure, point users to the Rooms page or the README.`;
