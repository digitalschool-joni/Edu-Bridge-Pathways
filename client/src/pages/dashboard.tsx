import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, CheckCircle, Volume2, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";

export default function Dashboard() {
  const { userProfile, studyPlan, moodEntries } = useStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [simplified, setSimplified] = useState(false);

  // Mock text-to-speech toggle
  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
    // In a real app, window.speechSynthesis would go here
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
                <h3 className="text-2xl font-bold mb-4">{studyPlan.recommendedMethod}</h3>
                <p className="text-blue-100 leading-relaxed max-w-xl">
                  {simplified 
                    ? "Work for 25 minutes. Take a 5 minute break. Repeat."
                    : "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. This helps maintain focus and prevents mental fatigue."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Practice Blocks */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-bold text-[#011f4b] mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {studyPlan.practiceBlocks.map((block, idx) => (
                <Card key={idx} className="border-l-4 border-l-[#005b96] hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
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
                    </div>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-[#005b96]">
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
                    <span className="font-bold text-[#005b96]">3/12</span>
                  </div>
                  <Progress value={25} className="h-2 bg-blue-100" />
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Latest Mood: <span className="font-bold">{latestMood > 0 ? `${latestMood}/5` : 'Not logged'}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
