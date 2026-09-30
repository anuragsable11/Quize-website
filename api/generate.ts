// POST /api/generate { topic, amount, difficulty } → { questions: [{ question, correct, incorrect, difficulty }] }
// Writes a multiple-choice quiz on any topic. `difficulty` is "easy", "medium", "hard" or "" for a mix.

import { AiError, chat, errorResponse, readJson, requireText } from "./_lib/hf.js"

export const config = { maxDuration: 60 }

const MAX_QUESTIONS = 20
const DIFFICULTIES = ["easy", "medium", "hard"]

type GeneratedQuestion = {
  question: string
  correct: string
  incorrect: string[]
  difficulty: string
}

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const topic = requireText(body.topic, 100)
    const amount = Number(body.amount)
    if (!Number.isInteger(amount) || amount < 1 || amount > MAX_QUESTIONS) throw new AiError("Invalid request.", 400)
    const difficulty = typeof body.difficulty === "string" && DIFFICULTIES.includes(body.difficulty) ? body.difficulty : ""

    const reply = await chat(
      [
        {
          role: "system",
          content:
            "You write multiple-choice trivia questions for a quiz website. Every question must be factually accurate and have exactly one correct answer. You reply with JSON only.",
        },
        { role: "user", content: prompt(topic, amount, difficulty) },
      ],
      // Leaves room for models that reason before answering
      { maxTokens: 4000 + amount * 200, temperature: 0.7, timeoutMs: 55_000 }
    )

    // A few unusable questions are dropped; many means the reply went wrong
    const questions = parseQuestions(reply, difficulty).slice(0, amount)
    if (questions.length < Math.ceil(amount / 2)) {
      console.error("Unusable quiz from the model:", reply.slice(0, 1000))
      throw new AiError(`Couldn't write a quiz about "${topic}". Please try again, or try a different topic.`)
    }
    return Response.json({ questions })
  } catch (err) {
    return errorResponse(err)
  }
}

const prompt = (topic: string, amount: number, difficulty: string) => `Write ${amount} multiple-choice trivia questions about this topic: ${topic}

Difficulty: ${difficulty || "a mix of easy, medium and hard"}.

Rules:
- Each question has exactly one correct answer and three wrong answers that are plausible but clearly wrong.
- Only use well-established facts you are sure of. Avoid anything disputed, ambiguous or likely to change over time.
- Don't give away the answer in the question, and don't repeat questions.
- Keep each question under 200 characters and each answer under 80 characters.
- If the topic is offensive or not something a quiz can be written about, reply with {"questions":[]}.

Reply with only this JSON and nothing else:
{"questions":[{"question":"...","correct":"...","incorrect":["...","...","..."],"difficulty":"easy"}]}`

// Collapses whitespace and rejects anything too long; models sometimes return numbers (e.g. years) unquoted
const clean = (value: unknown, max: number) => {
  const text = typeof value === "string" || typeof value === "number" ? String(value).replace(/\s+/g, " ").trim() : ""
  return text.length <= max ? text : ""
}

/** The questions in the model's reply, without malformed or repeated ones. */
function parseQuestions(reply: string, difficulty: string): GeneratedQuestion[] {
  // The JSON may be wrapped in a code fence or a sentence
  const json = reply.match(/[[{][\s\S]*[\]}]/)?.[0]
  let items: unknown
  try {
    const parsed = JSON.parse(json ?? "")
    items = Array.isArray(parsed) ? parsed : parsed?.questions
  } catch {
    return []
  }
  if (!Array.isArray(items)) return []

  const seen = new Set<string>()
  const questions: GeneratedQuestion[] = []
  for (const item of items) {
    if (!item || typeof item !== "object") continue
    const question = clean(item.question, 300)
    const correct = clean(item.correct, 150)

    // Three different wrong answers, none of them the correct one
    const incorrect: string[] = []
    for (const answer of Array.isArray(item.incorrect) ? item.incorrect : []) {
      const text = clean(answer, 150)
      if (text && ![correct, ...incorrect].some((a) => a.toLowerCase() === text.toLowerCase())) incorrect.push(text)
    }

    const key = question.toLowerCase()
    if (!question || !correct || incorrect.length < 3 || seen.has(key)) continue
    seen.add(key)
    questions.push({
      question,
      correct,
      incorrect: incorrect.slice(0, 3),
      difficulty: difficulty || (DIFFICULTIES.includes(item.difficulty) ? item.difficulty : "medium"),
    })
  }
  return questions
}
