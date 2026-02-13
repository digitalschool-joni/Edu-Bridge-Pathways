import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/ai/study-plan", async (req, res, next) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          message: "GEMINI_API_KEY is not configured on the server.",
        });
      }

      const payload = req.body as {
        answers?: string[];
        initialSurvey?: Record<string, unknown>;
        finalSurvey?: Record<string, unknown>;
      };
      const answers = Array.isArray(payload.answers) ? payload.answers : [];
      const initialSurvey = payload.initialSurvey ?? {};
      const finalSurvey = payload.finalSurvey ?? {};

      const prompt = `
You are an educational planning assistant.
Generate a JSON object only with this exact shape:
{
  "weeklyGoals": string[],
  "recommendedMethod": string,
  "practiceBlocks": [
    { "subject": string, "duration": string, "task": string }
  ]
}

Rules:
- Exactly 3 weeklyGoals.
- Exactly 3 practiceBlocks.
- Durations should be realistic like "30 mins" or "45 mins".
- recommendedMethod should be specific and actionable.
- Base recommendations on diagnostic answers, learning style, and personality/preferences.
- No markdown, no code fences, JSON only.

Diagnostic answers: ${JSON.stringify(answers)}
Initial survey: ${JSON.stringify(initialSurvey)}
Final survey: ${JSON.stringify(finalSurvey)}
      `.trim();

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!geminiResponse.ok) {
        const text = await geminiResponse.text();
        return res.status(502).json({
          message: `Gemini API error: ${geminiResponse.status} ${text}`,
        });
      }

      const data = (await geminiResponse.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        return res.status(502).json({ message: "Gemini returned an empty response." });
      }

      const parsed = JSON.parse(rawText) as {
        weeklyGoals?: unknown;
        recommendedMethod?: unknown;
        practiceBlocks?: unknown;
      };

      if (
        !Array.isArray(parsed.weeklyGoals) ||
        typeof parsed.recommendedMethod !== "string" ||
        !Array.isArray(parsed.practiceBlocks)
      ) {
        return res.status(502).json({ message: "Gemini response format was invalid." });
      }

      return res.json({
        weeklyGoals: parsed.weeklyGoals.slice(0, 3),
        recommendedMethod: parsed.recommendedMethod,
        practiceBlocks: parsed.practiceBlocks.slice(0, 3),
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/ai/tutor-tip", async (req, res, next) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          message: "GEMINI_API_KEY is not configured on the server.",
        });
      }

      const payload = req.body as {
        subject?: string;
        task?: string;
        learningStyle?: string;
      };

      const prompt = `
Give concise study guidance for a student.
Return JSON only with shape: { "tip": string, "microPlan": string[] }
Rules:
- tip: 1-2 sentences
- microPlan: exactly 3 short steps

Subject: ${payload.subject ?? "Unknown"}
Task: ${payload.task ?? "Unknown"}
Learning style: ${payload.learningStyle ?? "Not provided"}
      `.trim();

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.6,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!geminiResponse.ok) {
        const text = await geminiResponse.text();
        return res.status(502).json({ message: `Gemini API error: ${geminiResponse.status} ${text}` });
      }

      const data = (await geminiResponse.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return res.status(502).json({ message: "Gemini returned an empty response." });

      const parsed = JSON.parse(rawText) as { tip?: string; microPlan?: string[] };
      if (typeof parsed.tip !== "string" || !Array.isArray(parsed.microPlan)) {
        return res.status(502).json({ message: "Gemini response format was invalid." });
      }

      return res.json({
        tip: parsed.tip,
        microPlan: parsed.microPlan.slice(0, 3),
      });
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
