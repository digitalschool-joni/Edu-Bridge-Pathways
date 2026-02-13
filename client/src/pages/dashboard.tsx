import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, CheckCircle, Volume2, Sparkles, TrendingUp, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { buildPersonalizedRecommendations } from "@/lib/recommendations";

export default function Dashboard() {
  const {
    userProfile,
    studyPlan,
    moodEntries,
    initialSurvey,
    finalSurvey,
    methodFeedback,
    scheduleCompletions,
    addMethodFeedback,
    setScheduleCompletion,
  } = useStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [simplified, setSimplified] = useState(false);
  const [tutorTips, setTutorTips] = useState<Record<string, { tip: string; microPlan: string[] }>>({});
  const [loadingTips, setLoadingTips] = useState<Record<string, boolean>>({});

  const today = new Date().toISOString().slice(0, 10);

  const toggleSpeech = () => {
    setIsSpeaking((prev) => !prev);
  };

  if (!studyPlan) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-blue-100 p-6 rounded-full mb-6">
            <BookOpen className="h-12 w-12 text-[#005b96]" />
          </div>
          <h2 className="text-3xl font-display font-bold text-[#011f4b] mb-4">No Study Plan Yet</h2>
          <p className="text-gray-500 max-w-md mb-8">
            Take the diagnostic test to generate a personalized study roadmap tailored to your goals.
          </p>
          <Link href="/diagnostic">
            <Button size="lg" className="bg-[#005b96] hover:bg-[#03396c]">
              Start Diagnostic
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const latestMood = moodEntries[0]?.rating || 0;
  const personalized = buildPersonalizedRecommendations({
    studyPlan,
    initialSurvey,
    finalSurvey,
    moodEntries,
  });
  const methodReads = [personalized.topMethod.summary, ...personalized.topMethod.implementationSteps].join(" ");

  useEffect(() => {
    if (!window.speechSynthesis) return;
    if (!isSpeaking) {
      window.speechSynthesis.cancel();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(methodReads);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isSpeaking, methodReads]);

  const getBlockKey = (subject: string, task: string) => `${subject}::${task}`;

  const completedToday = scheduleCompletions.filter((entry) => entry.date === today && entry.completed);
  const completedCount = completedToday.length;
  const totalBlocks = personalized.scheduleDetails.length;
  const completionPercent = totalBlocks ? Math.round((completedCount / totalBlocks) * 100) : 0;

  const completionDays = Array.from(
    new Set(scheduleCompletions.filter((entry) => entry.completed).map((entry) => entry.date))
  ).sort((a, b) => (a < b ? 1 : -1));

  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!completionDays.includes(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const last7Days = Array.from({ length: 7 }, (_, idx) => {
    const day = new Date();
    day.setDate(day.getDate() - idx);
    const key = day.toISOString().slice(0, 10);
    const count = scheduleCompletions.filter((entry) => entry.date === key && entry.completed).length;
    return { key, count };
  }).reverse();

  const positiveMethodFeedback = methodFeedback.filter((entry) => entry.helpful).length;
  const feedbackRate = methodFeedback.length
    ? Math.round((positiveMethodFeedback / methodFeedback.length) * 100)
    : 0;

  const handleMethodFeedback = (helpful: boolean) => {
    addMethodFeedback({
      method: personalized.topMethod.name,
      helpful,
      date: new Date().toISOString(),
    });
  };

  const exportProgressSummary = () => {
    const lines = [
      `Student: ${userProfile?.name ?? "Student"}`,
      `Date: ${new Date().toISOString()}`,
      `Top Method: ${personalized.topMethod.name}`,
      `Completed Today: ${completedCount}/${totalBlocks}`,
      `Current Streak: ${streak} day(s)`,
      `Method Approval: ${feedbackRate}%`,
      "Weekly Goals:",
      ...studyPlan.weeklyGoals.map((goal) => `- ${goal}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "edubridge-progress-summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const requestTutorTip = async (subject: string, task: string) => {
    const key = getBlockKey(subject, task);
    setLoadingTips((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await fetch("/api/ai/tutor-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          task,
          learningStyle: initialSurvey?.learningStyle,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = (await response.json()) as { tip: string; microPlan: string[] };
      setTutorTips((prev) => ({ ...prev, [key]: data }));
    } catch (_error) {
      setTutorTips((prev) => ({
        ...prev,
        [key]: {
          tip: "Focus on one clear outcome for this block, then self-check before moving on.",
          microPlan: [
            "Define the exact question you need to solve.",
            "Work in a short timed sprint with no distractions.",
            "Summarize what worked and one thing to improve.",
          ],
        },
      }));
    } finally {
      setLoadingTips((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <Layout>
      <header className="mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-[#011f4b]">
            Hello, {userProfile?.name?.split(' ')[0] || "Student"}
          </h1>
          <p className="text-gray-500 mt-2">Here's your learning roadmap for today.</p>
        </motion.div>
      </header>

      {!initialSurvey && (
        <Card className="mb-6 border-0 shadow-md bg-[#b3cde0]/20">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#011f4b]">Complete the Initial Survey</h2>
              <p className="text-sm text-gray-600">This separate step helps personalize your dashboard.</p>
            </div>
            <Link href="/survey">
              <Button className="bg-[#005b96] hover:bg-[#03396c]">Start Survey</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {initialSurvey && !finalSurvey && (
        <Card className="mb-6 border-0 shadow-md bg-white">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#011f4b]">Year 4 Personality Test</h2>
              <p className="text-sm text-gray-600">Unlock universities and alumni when you are ready.</p>
            </div>
            <Link href="/personality-test">
              <Button variant="outline">Take Personality Test</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Focus Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#011f4b] to-[#03396c] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-blue-100">Recommended Method</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`text-blue-100 hover:text-white hover:bg-white/10 ${isSpeaking ? 'bg-white/20' : ''}`}
                    onClick={toggleSpeech}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    {isSpeaking ? 'Reading...' : 'Read Aloud'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className={`text-blue-100 hover:text-white hover:bg-white/10 ${simplified ? 'bg-white/20' : ''}`}
                    onClick={() => setSimplified(!simplified)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {simplified ? 'Original' : 'Simplify'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold mb-4 text-white">{personalized.topMethod.name}</h3>
                <p className="text-blue-100 leading-relaxed max-w-xl">
                  {simplified 
                    ? personalized.simplifiedPlan
                    : personalized.topMethod.summary}
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {personalized.alternateMethods.map((method) => (
                    <div key={method.name} className="rounded-lg border border-white/20 bg-white/10 p-3">
                      <p className="text-xs uppercase tracking-wide text-blue-100">Alternative</p>
                      <p className="font-semibold text-white">{method.name}</p>
                      <p className="text-xs text-blue-100 mt-1">{method.reason}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-[#03396c] hover:bg-blue-100"
                    onClick={() => handleMethodFeedback(true)}
                  >
                    This helped
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-[#03396c] hover:bg-blue-100"
                    onClick={() => handleMethodFeedback(false)}
                  >
                    Not helpful
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[#011f4b]">Extra Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {personalized.explanation.map((line) => (
                  <p key={line} className="text-sm text-slate-700">
                    {line}
                  </p>
                ))}
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-[#03396c] mb-2">How to run this method today</p>
                  <ul className="space-y-2">
                    {personalized.topMethod.implementationSteps.map((step) => (
                      <li key={step} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="min-w-[6px] h-[6px] rounded-full bg-[#005b96] mt-2" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Practice Blocks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-[#011f4b] mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {personalized.scheduleDetails.map((block, idx) => (
                <Card key={idx} className="border-l-4 border-l-[#005b96] hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="bg-blue-50 text-[#005b96] hover:bg-blue-100">
                          {block.subject}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" /> {block.duration}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">{block.task}</p>
                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        <p><span className="font-medium text-slate-700">Focus Strategy:</span> {block.strategy}</p>
                        <p><span className="font-medium text-slate-700">Checkpoint:</span> {block.checkpoint}</p>
                        <p><span className="font-medium text-slate-700">Break Plan:</span> {block.breakPlan}</p>
                        <p><span className="font-medium text-slate-700">Expected Output:</span> {block.output}</p>
                      </div>
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void requestTutorTip(block.subject, block.task)}
                          disabled={loadingTips[getBlockKey(block.subject, block.task)]}
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          {loadingTips[getBlockKey(block.subject, block.task)] ? "Generating tip..." : "Ask AI Tutor"}
                        </Button>
                      </div>
                      {tutorTips[getBlockKey(block.subject, block.task)] && (
                        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2">
                          <p className="text-xs text-[#03396c] font-semibold mb-1">Tutor Tip</p>
                          <p className="text-xs text-slate-700">
                            {tutorTips[getBlockKey(block.subject, block.task)].tip}
                          </p>
                          <ul className="mt-1 space-y-1">
                            {tutorTips[getBlockKey(block.subject, block.task)].microPlan.map((step) => (
                              <li key={step} className="text-xs text-slate-700">- {step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`${
                        completedToday.some(
                          (entry) => entry.blockKey === getBlockKey(block.subject, block.task)
                        )
                          ? "text-green-600 hover:text-green-700"
                          : "text-gray-400 hover:text-[#005b96]"
                      }`}
                      onClick={() =>
                        setScheduleCompletion({
                          blockKey: getBlockKey(block.subject, block.task),
                          date: today,
                          completed: !completedToday.some(
                            (entry) => entry.blockKey === getBlockKey(block.subject, block.task)
                          ),
                        })
                      }
                    >
                      <CheckCircle className="h-6 w-6" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar - Right 1/3 */}
        <div className="space-y-6">
          {/* Weekly Goals */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {studyPlan.weeklyGoals.map((goal, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="min-w-[6px] h-[6px] rounded-full bg-[#005b96] mt-2" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-[#b3cde0]/20 border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#005b96]" /> 
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Diagnostic</span>
                    <span className="font-bold text-[#005b96]">Complete</span>
                  </div>
                  <Progress value={100} className="h-2 bg-blue-100" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Weekly Tasks</span>
                    <span className="font-bold text-[#005b96]">{completedCount}/{totalBlocks} today</span>
                  </div>
                  <Progress value={completionPercent} className="h-2 bg-blue-100" />
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Latest Mood: <span className="font-bold">{latestMood > 0 ? `${latestMood}/5` : 'Not logged'}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Streak: <span className="font-bold">{streak} day(s)</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Method approval: <span className="font-bold">{feedbackRate}%</span>
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 mb-1">Last 7 days completion</p>
                    <div className="flex items-end gap-1 h-12">
                      {last7Days.map((day) => (
                        <div
                          key={day.key}
                          className="flex-1 bg-[#6497b1]/30 rounded-sm"
                          style={{ height: `${Math.max(10, day.count * 14)}px` }}
                          title={`${day.key}: ${day.count} block(s)`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button type="button" size="sm" variant="outline" className="mt-3" onClick={exportProgressSummary}>
                    Export Progress Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
