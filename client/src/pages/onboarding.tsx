import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { userProfileSchema, initialSurveySchema } from "@shared/schema";
import { z } from "zod";
import { ChevronRight, Check } from "lucide-react";

// Combined schema for the wizard
const step1Schema = userProfileSchema;
const step2Schema = initialSurveySchema;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { updateUserProfile, updateInitialSurvey } = useStore();

  const form1 = useForm<z.infer<typeof step1Schema>>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      age: "",
      location: "",
      school: "",
      languages: "",
    }
  });

  const form2 = useForm<z.infer<typeof step2Schema>>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      favoriteSubjects: "",
      weakSubjects: "",
      interests: "",
      learningStyle: "Visual",
      studyMethod: "Active recall",
      academicGoals: "",
      personalGoals: "",
    }
  });

  const onStep1Submit = (data: z.infer<typeof step1Schema>) => {
    updateUserProfile(data);
    setStep(2);
  };

  const onStep2Submit = (data: z.infer<typeof step2Schema>) => {
    updateInitialSurvey(data);
    setLocation("/diagnostic");
  };

  return (
    <div className="min-h-screen bg-[#011f4b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#005b96] rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#6497b1] rounded-full opacity-10 blur-3xl" />
      </div>

      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur shadow-2xl rounded-2xl border-0 overflow-hidden z-10">
        <div className="h-2 bg-[#b3cde0]">
          <motion.div 
            className="h-full bg-[#005b96]" 
            initial={{ width: "0%" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#011f4b] mb-2">
              {step === 1 ? "Welcome to EduBridge" : "Tell Us More"}
            </h1>
            <p className="text-[#6497b1]">
              {step === 1 ? "Let's start building your personalized educational profile." : "Help us understand how you learn best."}
            </p>
          </div>

          {step === 1 ? (
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form1.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} className="bg-slate-50 border-slate-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form1.control} name="age" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl><Input placeholder="16" type="number" {...field} className="bg-slate-50 border-slate-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form1.control} name="school" render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl><Input placeholder="Lincoln High School" {...field} className="bg-slate-50 border-slate-200" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form1.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl><Input placeholder="New York, NY" {...field} className="bg-slate-50 border-slate-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form1.control} name="languages" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Spoken</FormLabel>
                      <FormControl><Input placeholder="English, Spanish..." {...field} className="bg-slate-50 border-slate-200" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" size="lg" className="bg-[#005b96] hover:bg-[#03396c]">
                    Next Step <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form2.control} name="learningStyle" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Learning Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Visual", "Audio", "Reading", "Kinesthetic"].map(style => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form2.control} name="studyMethod" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Study Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["Active recall", "Spaced repetition", "Practice problems", "Concept explanation", "Flashcards"].map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form2.control} name="favoriteSubjects" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Subjects</FormLabel>
                    <FormControl><Input placeholder="Math, Physics, History..." {...field} className="bg-slate-50 border-slate-200" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form2.control} name="academicGoals" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key Academic Goal</FormLabel>
                    <FormControl><Textarea placeholder="I want to improve my calculus grade..." {...field} className="bg-slate-50 border-slate-200 resize-none" rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="bg-[#005b96] hover:bg-[#03396c]">
                    Start Diagnostic <Check className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </Card>
    </div>
  );
}
