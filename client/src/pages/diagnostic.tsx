import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const QUESTIONS = [
  {
    id: 1,
    text: "When facing a difficult math problem, what is your first instinct?",
    options: [
      "Look for a similar example in the textbook",
      "Draw a diagram to visualize it",
      "Ask a friend or teacher immediately",
      "Try to break it down into smaller parts on my own"
    ]
  },
  {
    id: 2,
    text: "How do you typically prepare for a history exam?",
    options: [
      "Memorize dates and names using flashcards",
      "Create a timeline of events",
      "Read the chapters again",
      "Discuss the events with a study group"
    ]
  },
  {
    id: 3,
    text: "Which environment helps you focus best?",
    options: [
      "Complete silence in a library",
      "Coffee shop with background noise",
      "My room with music playing",
      "Outdoors in nature"
    ]
  },
  {
    id: 4,
    text: "When reading a complex text, you usually...",
    options: [
      "Highlight almost everything",
      "Take notes in the margins",
      "Summarize each paragraph in my head",
      "Read it out loud"
    ]
  },
  {
    id: 5,
    text: "What motivates you most to study?",
    options: [
      "Getting good grades",
      "Understanding how things work",
      "Competitive spirit",
      "Fear of falling behind"
    ]
  }
];

export default function Diagnostic() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [, setLocation] = useLocation();
  const updateStudyPlan = useStore(state => state.updateStudyPlan);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQ]: value }));
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      finishDiagnostic();
    }
  };

  const finishDiagnostic = () => {
    // In a real app, this would use AI to generate the plan based on answers
    // Here we generate a mock plan
    updateStudyPlan({
      weeklyGoals: [
        "Complete 3 math practice sets",
        "Review history timeline for Chapter 4",
        "Spend 20 mins daily on active recall"
      ],
      recommendedMethod: "Pomodoro Technique (25m work / 5m break)",
      practiceBlocks: [
        { subject: "Mathematics", duration: "45 mins", task: "Calculus Limits - Practice Set A" },
        { subject: "History", duration: "30 mins", task: "WWII Timeline Construction" },
        { subject: "Physics", duration: "45 mins", task: "Force Diagrams Review" }
      ]
    });
    setLocation("/dashboard");
  };

  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-xl overflow-hidden border-0">
        <div className="bg-[#011f4b] p-8 text-white text-center">
          <h1 className="text-2xl font-display font-bold mb-2">Diagnostic Assessment</h1>
          <p className="text-blue-200">Analyzing your study habits...</p>
        </div>
        
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <h2 className="text-xl font-medium text-[#03396c] mb-6">
              {QUESTIONS[currentQ].text}
            </h2>

            <RadioGroup onValueChange={handleAnswer} value={answers[currentQ]} className="space-y-4">
              {QUESTIONS[currentQ].options.map((option, idx) => (
                <div key={idx} className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${answers[currentQ] === option ? 'border-[#005b96] bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}>
                  <RadioGroupItem value={option} id={`q${currentQ}-opt${idx}`} />
                  <Label htmlFor={`q${currentQ}-opt${idx}`} className="flex-1 cursor-pointer font-normal text-base text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </motion.div>

          <div className="flex justify-end">
            <Button 
              onClick={handleNext} 
              disabled={!answers[currentQ]}
              size="lg"
              className="bg-[#005b96] hover:bg-[#03396c] px-8"
            >
              {currentQ === QUESTIONS.length - 1 ? "Generate My Plan" : "Next Question"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
