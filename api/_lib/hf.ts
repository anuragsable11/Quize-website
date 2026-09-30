// Shared code for the AI functions in api/. Vercel doesn't deploy files in "_" folders as functions.
//
// Models are called through Hugging Face Inference Providers (https://huggingface.co/docs/inference-providers),
// an OpenAI-compatible chat API. The token never reaches the browser: set HF_TOKEN in .env for
// `npm run dev`, and in the Vercel project's environment variables for production.

const API_URL = "https://router.huggingface.co/v1/chat/completions"

// Served by many providers, including very fast ones (Groq, Cerebras). Override with HF_MODEL.
const DEFAULT_MODEL = "openai/gpt-oss-120b"

/** An error whose message is safe to show to the player. */
export class AiError extends Error {
  status: number

  constructor(message: string, status = 502) {
    super(message)
    this.status = status
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  401: "AI features are unavailable: the site's Hugging Face token was rejected.",
  403: "AI features are unavailable: the site's Hugging Face token was rejected.",
  402: "This site has used up its AI credits for now. Please try again later.",
  429: "The AI is busy right now. Please wait a moment and try again.",
}

type Message = { role: "system" | "user"; content: string }

type ChatOptions = {
  /** Upper bound on tokens, including any reasoning the model does before answering */
  maxTokens: number
  temperature: number
  timeoutMs: number
}

type ChatResponse = {
  choices?: { message?: { content?: unknown }; finish_reason?: string }[]
}

/** Send a chat to the model and return its answer as text. */
export async function chat(messages: Message[], { maxTokens, temperature, timeoutMs }: ChatOptions): Promise<string> {
  const token = process.env.HF_TOKEN
  if (!token) {
    console.error("HF_TOKEN is not set")
    throw new AiError("AI features aren't set up on this site yet.", 503)
  }

  let data: ChatResponse
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.HF_MODEL || DEFAULT_MODEL,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) {
      console.error(`Hugging Face API error ${res.status}:`, (await res.text()).slice(0, 500))
      throw new AiError(STATUS_MESSAGES[res.status] ?? "The AI service had a problem. Please try again.")
    }
    data = (await res.json()) as ChatResponse
  } catch (err) {
    if (err instanceof AiError) throw err
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new AiError("The AI took too long to answer. Please try again.", 504)
    }
    console.error("Hugging Face request failed:", err)
    throw new AiError("Couldn't reach the AI service. Please try again.")
  }

  const choice = data.choices?.[0]
  const content = choice?.message?.content
  // Some models include their reasoning in <think> tags before the answer
  const text = typeof content === "string" ? content.replace(/<think>[\s\S]*?<\/think>/g, "").trim() : ""
  if (!text) {
    console.error("Empty answer from the model, finish_reason:", choice?.finish_reason)
    throw new AiError("The AI didn't give an answer. Please try again.")
  }
  return text
}

/** The request body as a JSON object. */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new AiError("Invalid request.", 400)
  return body as Record<string, unknown>
}

/** A trimmed, non-empty string of at most `max` characters. */
export function requireText(value: unknown, max: number): string {
  const text = typeof value === "string" ? value.trim() : ""
  if (!text || text.length > max) throw new AiError("Invalid request.", 400)
  return text
}

/** A JSON error response whose `error` message the client can show. */
export function errorResponse(err: unknown): Response {
  if (err instanceof AiError) return Response.json({ error: err.message }, { status: err.status })
  console.error(err)
  return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 })
}
