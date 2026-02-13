import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { moodEntrySchema } from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Smile, Meh, Frown, ThumbsUp, Heart } from "lucide-react";

const MOOD_EMOJIS = [
  { val: 1, icon: Frown, color: "text-red-500" },
  { val: 2, icon: Meh, color: "text-orange-500" },
  { val: 3, icon: Smile, color: "text-yellow-500" },
  { val: 4, icon: ThumbsUp, color: "text-blue-500" },
  { val: 5, icon: Heart, color: "text-pink-500" },
];

export default function MoodTracker() {
  const { moodEntries, addMoodEntry } = useStore();
  const [selectedRating, setSelectedRating] = useState<number>(3);

  const form = useForm({
    defaultValues: {
      note: "",
    }
  });

  const onSubmit = (data: { note: string }) => {
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      rating: selectedRating,
      note: data.note,
    };
    addMoodEntry(newEntry);
    form.reset();
  };

  // Prepare data for chart (reverse to show chronological order)
  const chartData = [...moodEntries].reverse().map(entry => ({
    date: format(new Date(entry.date), 'MMM d'),
    rating: entry.rating,
  }));

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#011f4b]">Mood Tracker</h1>
        <p className="text-gray-500 mt-2">Track your wellbeing and emotional patterns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-8 px-4">
                {MOOD_EMOJIS.map(({ val, icon: Icon, color }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedRating(val)}
                    className={`flex flex-col items-center gap-2 transition-transform hover:scale-110 ${selectedRating === val ? 'scale-110' : 'opacity-50'}`}
                  >
                    <Icon className={`h-10 w-10 ${color} ${selectedRating === val ? 'fill-current' : ''}`} />
                    <span className="text-xs font-bold text-gray-500">{val}</span>
                  </button>
                ))}
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Reflection (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What made you feel this way? Any stressors or wins?" 
                            {...field} 
                            rows={4}
                            className="bg-slate-50 border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-[#005b96] hover:bg-[#03396c]">
                    Log Mood
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* History Card */}
        <div className="space-y-8">
          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Mood History</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" fontSize={12} tickMargin={10} />
                      <YAxis domain={[1, 5]} hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rating" 
                        stroke="#005b96" 
                        strokeWidth={3} 
                        dot={{ fill: '#005b96', strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 italic">
                    No entries yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {moodEntries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex flex-col items-center justify-center min-w-[3rem]">
                        <span className="text-2xl font-bold text-[#005b96]">{entry.rating}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Rating</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">
                          {format(new Date(entry.date), 'MMM d, yyyy • h:mm a')}
                        </p>
                        <p className="text-sm text-gray-700 italic">
                          "{entry.note || "No note added"}"
                        </p>
                      </div>
                    </div>
                  ))}
                  {moodEntries.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Start logging to see your history.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
