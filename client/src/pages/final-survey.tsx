import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useStore } from "@/lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { finalSurveySchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function FinalSurvey() {
  const { updateFinalSurvey } = useStore();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof finalSurveySchema>>({
    resolver: zodResolver(finalSurveySchema),
    defaultValues: {
      personality: {
        "Analytical": "",
        "Creative": "",
        "Social": "",
        "Organized": ""
      },
      values: [],
      preferences: {
        workEnvironment: "",
        studyEnvironment: "",
        location: "",
        approach: ""
      }
    }
  });

  const onSubmit = (data: z.infer<typeof finalSurveySchema>) => {
    updateFinalSurvey(data);
    setSubmitted(true);
    toast({
      title: "Assessment Saved",
      description: "Your comprehensive profile has been updated.",
    });
  };

  if (submitted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-green-100 p-6 rounded-full mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-[#011f4b] mb-4">Assessment Complete!</h2>
          <p className="text-gray-500 max-w-md mb-8">
            Thank you for completing your profile. Your career and university recommendations have been refined based on these new insights.
          </p>
          <Button href="/career" className="bg-[#005b96] hover:bg-[#03396c]">
            View Career Matches
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#011f4b]">Final Assessment</h1>
        <p className="text-gray-500 mt-2">Deep dive into your personality and work values to refine our matches.</p>
      </header>

      <Card className="max-w-3xl">
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personality Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#03396c] border-b pb-2">Personality Traits</h3>
                <p className="text-sm text-gray-500 mb-4">To what extent do you agree with the following?</p>
                
                {["Analytical", "Creative", "Social", "Organized"].map((trait) => (
                  <FormField
                    key={trait}
                    control={form.control}
                    name={`personality.${trait}`}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>I consider myself {trait.toLowerCase()}.</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Strongly Disagree">Strongly Disagree</SelectItem>
                            <SelectItem value="Disagree">Disagree</SelectItem>
                            <SelectItem value="Neutral">Neutral</SelectItem>
                            <SelectItem value="Agree">Agree</SelectItem>
                            <SelectItem value="Strongly Agree">Strongly Agree</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Preferences Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#03396c] border-b pb-2">Work Preferences</h3>
                
                <FormField
                  control={form.control}
                  name="preferences.workEnvironment"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Preferred Work Environment</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Remote" /></FormControl>
                            <FormLabel className="font-normal">Remote / Work from home</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Office" /></FormControl>
                            <FormLabel className="font-normal">Traditional Office</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Hybrid" /></FormControl>
                            <FormLabel className="font-normal">Hybrid</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="Field" /></FormControl>
                            <FormLabel className="font-normal">Field work / Outdoors</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full bg-[#005b96] hover:bg-[#03396c]">
                  Save & Complete Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}
