import type { EduBridgeState } from "@shared/schema";

type MethodKey =
  | "Pomodoro Technique"
  | "Active Recall Sprints"
  | "Spaced Repetition Plan"
  | "Practice Problem Ladder"
  | "Teach-Back Method"
  | "Concept Mapping Studio"
  | "Audio Reflection Review";

type MethodProfile = {
  name: MethodKey;
  baseScore: number;
  summary: string;
  simplified: string;
  implementationSteps: string[];
  bestFor: string[];
};

type PersonalityLevels = Record<string, number>;

type RecommendationMethod = {
  name: string;
  score: number;
  summary: string;
  implementationSteps: string[];
  reason: string;
};

export type ScheduleDetail = {
  subject: string;
  duration: string;
  task: string;
  strategy: string;
  checkpoint: string;
  breakPlan: string;
  output: string;
};

export type PersonalizedRecommendations = {
  topMethod: RecommendationMethod;
  alternateMethods: RecommendationMethod[];
  explanation: string[];
  simplifiedPlan: string;
  scheduleDetails: ScheduleDetail[];
};

const METHOD_LIBRARY: MethodProfile[] = [
  {
    name: "Pomodoro Technique",
    baseScore: 60,
    summary:
      "Use focused 25-minute sessions with short resets to protect energy and stay consistent.",
    simplified:
      "Study in short rounds, then take quick breaks and repeat.",
    implementationSteps: [
      "Set one clear task for 25 minutes.",
      "Work with no distractions until timer ends.",
      "Take a 5-minute break and reset.",
      "After 4 rounds, take a longer break.",
    ],
    bestFor: ["consistency", "energy control", "time-boxed work"],
  },
  {
    name: "Active Recall Sprints",
    baseScore: 58,
    summary:
      "Retrieve key ideas from memory first, then check notes to close specific gaps quickly.",
    simplified:
      "Test yourself from memory, then correct mistakes right away.",
    implementationSteps: [
      "Close notes and write what you remember.",
      "Check against source material.",
      "Mark weak points and retry from memory.",
      "Repeat until recall is cleaner.",
    ],
    bestFor: ["exam prep", "memory retention", "faster mastery"],
  },
  {
    name: "Spaced Repetition Plan",
    baseScore: 54,
    summary:
      "Review topics on planned intervals to lock concepts into long-term memory.",
    simplified:
      "Review topics multiple times over days, not all at once.",
    implementationSteps: [
      "Create short review cards or prompts.",
      "Review today, then again in 2 days.",
      "Revisit in 1 week and 2 weeks.",
      "Spend extra rounds on low-confidence cards.",
    ],
    bestFor: ["long-term memory", "language/content-heavy courses", "steady progress"],
  },
  {
    name: "Practice Problem Ladder",
    baseScore: 55,
    summary:
      "Move from easy to medium to hard problems while logging mistakes and patterns.",
    simplified:
      "Start simple, increase difficulty, and learn from each mistake.",
    implementationSteps: [
      "Solve 3 easy warm-up questions.",
      "Complete 4 medium questions.",
      "Finish with 2 hard questions.",
      "Write one correction note for every miss.",
    ],
    bestFor: ["quantitative subjects", "accuracy", "confidence building"],
  },
  {
    name: "Teach-Back Method",
    baseScore: 50,
    summary:
      "Explain concepts out loud in simple language to expose gaps and reinforce understanding.",
    simplified:
      "Teach the topic like a mini lesson to prove you understand it.",
    implementationSteps: [
      "Pick one concept and explain it in 3 minutes.",
      "Notice where explanations are unclear.",
      "Recheck sources and improve explanation.",
      "Repeat with a second concept.",
    ],
    bestFor: ["deep understanding", "social learners", "presentation readiness"],
  },
  {
    name: "Concept Mapping Studio",
    baseScore: 48,
    summary:
      "Use visual maps to connect ideas, causes, formulas, and examples across topics.",
    simplified:
      "Draw how ideas connect instead of memorizing isolated facts.",
    implementationSteps: [
      "Place the core topic in the center.",
      "Add branches for key concepts.",
      "Link branches with cause/effect notes.",
      "Attach one example to each branch.",
    ],
    bestFor: ["visual organization", "big-picture thinking", "complex chapters"],
  },
  {
    name: "Audio Reflection Review",
    baseScore: 46,
    summary:
      "Record short verbal summaries and replay them to reinforce memory and understanding.",
    simplified:
      "Say key ideas out loud, record them, and listen again later.",
    implementationSteps: [
      "Record a 2-minute summary after each block.",
      "Replay during breaks or commute time.",
      "Pause and restate weak parts aloud.",
      "Update recording with clearer language.",
    ],
    bestFor: ["audio learners", "verbal reinforcement", "lightweight review"],
  },
];

function agreementToScore(value?: string): number {
  switch (value) {
    case "Strongly Agree":
      return 5;
    case "Agree":
      return 4;
    case "Neutral":
      return 3;
    case "Disagree":
      return 2;
    case "Strongly Disagree":
      return 1;
    default:
      return 3;
  }
}

function getPersonalityLevels(
  personality?: NonNullable<EduBridgeState["finalSurvey"]>["personality"]
): PersonalityLevels {
  if (!personality) return {};

  const levels: PersonalityLevels = {};
  for (const [trait, value] of Object.entries(personality)) {
    levels[trait] = agreementToScore(value);
  }
  return levels;
}

function methodScoreAdjustments(
  method: MethodProfile,
  state: Pick<EduBridgeState, "initialSurvey" | "finalSurvey" | "moodEntries">
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = method.baseScore;

  const learningStyle = state.initialSurvey?.learningStyle;
  const baselineMethod = state.initialSurvey?.studyMethod;
  const personality = getPersonalityLevels(state.finalSurvey?.personality);
  const latestMood = state.moodEntries[0]?.rating ?? 3;
  const workEnvironment = state.finalSurvey?.preferences?.workEnvironment;

  if (baselineMethod && method.name.includes(baselineMethod)) {
    score += 6;
    reasons.push(`Matches your selected study method (${baselineMethod}).`);
  }

  if (learningStyle === "Visual" && method.name === "Concept Mapping Studio") {
    score += 14;
    reasons.push("Your visual learning style aligns with concept maps.");
  }
  if (learningStyle === "Audio" && method.name === "Audio Reflection Review") {
    score += 14;
    reasons.push("Your audio learning style aligns with verbal review.");
  }
  if (learningStyle === "Reading" && method.name === "Spaced Repetition Plan") {
    score += 10;
    reasons.push("Reading preference benefits from repeat written review.");
  }
  if (learningStyle === "Kinesthetic" && method.name === "Practice Problem Ladder") {
    score += 12;
    reasons.push("Kinesthetic learning is reinforced through active problem solving.");
  }

  if ((personality.Analytical ?? 3) >= 4 && method.name === "Practice Problem Ladder") {
    score += 10;
    reasons.push("Your analytical profile benefits from step-by-step challenge progression.");
  }
  if ((personality.Creative ?? 3) >= 4 && method.name === "Concept Mapping Studio") {
    score += 8;
    reasons.push("Your creative profile benefits from visual synthesis and pattern links.");
  }
  if ((personality.Social ?? 3) >= 4 && method.name === "Teach-Back Method") {
    score += 10;
    reasons.push("Your social profile benefits from discussion-based learning.");
  }
  if ((personality.Organized ?? 3) >= 4 && method.name === "Pomodoro Technique") {
    score += 8;
    reasons.push("Your organized profile fits structured time blocks.");
  }

  if (workEnvironment === "Remote" && method.name === "Pomodoro Technique") {
    score += 5;
    reasons.push("Remote preference pairs well with independent timed sessions.");
  }
  if (workEnvironment === "Hybrid" && method.name === "Spaced Repetition Plan") {
    score += 4;
    reasons.push("Hybrid preference benefits from portable distributed reviews.");
  }
  if (workEnvironment === "Field" && method.name === "Practice Problem Ladder") {
    score += 4;
    reasons.push("Field preference benefits from practical task progression.");
  }

  if (latestMood <= 2 && method.name === "Pomodoro Technique") {
    score += 6;
    reasons.push("Short focused rounds help when motivation is lower.");
  }

  return {
    score,
    reasons,
  };
}

function buildScheduleDetails(
  practiceBlocks: NonNullable<EduBridgeState["studyPlan"]>["practiceBlocks"],
  methods: RecommendationMethod[]
): ScheduleDetail[] {
  const fallbackStrategy = methods[0]?.name ?? "Pomodoro Technique";
  return practiceBlocks.map((block, index) => {
    const method = methods[index % methods.length];
    const strategy = method?.name ?? fallbackStrategy;
    return {
      subject: block.subject,
      duration: block.duration,
      task: block.task,
      strategy,
      checkpoint: `By minute ${Math.max(10, 15 + index * 5)}, complete a quick self-check for this block.`,
      breakPlan: "Take a 5-minute reset after the block. Stand up, hydrate, then continue.",
      output: `End with a short written summary of what you learned in ${block.subject}.`,
    };
  });
}

export function buildPersonalizedRecommendations(
  state: Pick<EduBridgeState, "studyPlan" | "initialSurvey" | "finalSurvey" | "moodEntries">
): PersonalizedRecommendations {
  const ranked = METHOD_LIBRARY.map((method) => {
    const adjusted = methodScoreAdjustments(method, state);
    const reason = adjusted.reasons[0] ?? `Strong fit for ${method.bestFor[0]}.`;
    return {
      name: method.name,
      score: adjusted.score,
      summary: method.summary,
      implementationSteps: method.implementationSteps,
      reason,
    };
  }).sort((a, b) => b.score - a.score);

  const topMethod = ranked[0];
  const alternateMethods = ranked.slice(1, 4);
  const explanation = [
    `Primary method was selected from your learning style and personality responses.`,
    `Top fit reason: ${topMethod.reason}`,
    "Alternates are included so you can rotate methods if your energy or workload changes.",
  ];

  const simplifiedPlan =
    METHOD_LIBRARY.find((method) => method.name === topMethod.name)?.simplified ??
    "Use short focused sessions with checkpoints and regular review.";

  const scheduleDetails = buildScheduleDetails(state.studyPlan?.practiceBlocks ?? [], ranked);

  return {
    topMethod,
    alternateMethods,
    explanation,
    simplifiedPlan,
    scheduleDetails,
  };
}
