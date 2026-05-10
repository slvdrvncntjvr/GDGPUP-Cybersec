// Tiny REST client for Google's Generative Language API. We deliberately do
// not pull in `@google/generative-ai` — a single fetch keeps the server bundle
// small and works on Vercel's Node runtime without any extra config.

export interface GeminiTurn {
  role: "user" | "model";
  text: string;
}

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

function endpointFor(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * Calls Gemini's `generateContent` endpoint with a system instruction and a
 * short turn history.
 *
 * Returns `null` when the API key is missing, the request fails, or the model
 * declines to answer — callers must always provide a fallback.
 */
export async function askGemini(opts: {
  systemInstruction: string;
  history: GeminiTurn[];
  signal?: AbortSignal;
}): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (opts.history.length === 0) return null;

  const model = DEFAULT_MODEL;
  const body = {
    system_instruction: {
      parts: [{ text: opts.systemInstruction }],
    },
    contents: opts.history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.text }],
    })),
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: 320,
      responseMimeType: "text/plain",
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  // Belt-and-suspenders timeout in case the platform dropped the per-request
  // limit; keeps a slow Gemini call from holding a serverless invocation open.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  const signal = opts.signal
    ? mergeSignals(opts.signal, controller.signal)
    : controller.signal;

  try {
    const res = await fetch(endpointFor(model), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      console.warn(
        `[gemini] non-OK response: ${res.status} ${res.statusText}`
      );
      return null;
    }
    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
      promptFeedback?: { blockReason?: string };
    };

    if (data.promptFeedback?.blockReason) {
      console.warn(
        `[gemini] prompt blocked: ${data.promptFeedback.blockReason}`
      );
      return null;
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) return null;
    return text;
  } catch (err) {
    if ((err as any)?.name === "AbortError") {
      console.warn("[gemini] request aborted (timeout)");
    } else {
      console.warn("[gemini] request failed:", err);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  if (a.aborted) return a;
  if (b.aborted) return b;
  const controller = new AbortController();
  const onAbortA = () => controller.abort((a as any).reason);
  const onAbortB = () => controller.abort((b as any).reason);
  a.addEventListener("abort", onAbortA, { once: true });
  b.addEventListener("abort", onAbortB, { once: true });
  return controller.signal;
}
