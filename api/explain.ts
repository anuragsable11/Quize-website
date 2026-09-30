// POST /api/explain { question, correct, answer } → { explanation }
// Explains why the correct answer to a quiz question is right. `answer` is null when time ran out.

import { chat, errorResponse, readJson, requireText } from "./_lib/hf.js"

export const config = { maxDuration: 30 }

export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const question = requireText(body.question, 500)
    const correct = requireText(body.correct, 200)
    const answer = body.answer == null ? null : requireText(body.answer, 200)
    const wrong = answer !== null && answer !== correct

    const played =
      answer === null
        ? "The player ran out of time."
        : wrong
          ? `The player answered: ${answer}`
          : "The player answered correctly."

    const explanation = await chat(
      [
        {
          role: "system",
          content: "You are a friendly tutor on a trivia quiz website. You explain answers accurately and briefly, in plain language.",
        },
        {
          role: "user",
          content: [
            `Quiz question: ${question}`,
            `Correct answer: ${correct}`,
            played,
            "",
            `In two or three short sentences, explain why "${correct}" is correct${wrong ? ` and why "${answer}" is not` : ""}.`,
            "Only state well-established facts; don't add extra trivia. Reply in plain text, with no heading or preamble.",
          ].join("\n"),
        },
      ],
      { maxTokens: 1500, temperature: 0.3, timeoutMs: 25_000 }
    )

    // Plain text is shown as-is, so drop any bold markers the model adds anyway
    return Response.json({ explanation: explanation.replace(/\*\*(.+?)\*\*/g, "$1") })
  } catch (err) {
    return errorResponse(err)
  }
}
