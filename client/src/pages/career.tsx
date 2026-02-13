import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, DollarSign, Book } from "lucide-react";
import { motion } from "framer-motion";

const CAREERS = [
  {
    title: "Data Scientist",
    match: "98%",
    salary: "$110k - $160k",
    growth: "+22% (High)",
    education: "Master's Degree",
    description: "Analyze complex data to help organizations make better decisions. Requires strong math and coding skills.",
    tags: ["Analytical", "Python", "Statistics"]
  },
  {
    title: "Software Engineer",
    match: "94%",
    salary: "$95k - $150k",
    growth: "+25% (Very High)",
    education: "Bachelor's Degree",
    description: "Design and build software applications. Involves problem-solving and continuous learning.",
    tags: ["Coding", "Logic", "Systems"]
  },
  {
    title: "Product Manager",
    match: "88%",
    salary: "$100k - $145k",
    growth: "+10% (Steady)",
    education: "Bachelor's + MBA",
    description: "Lead the development of products from conception to launch. Requires leadership and communication.",
    tags: ["Leadership", "Strategy", "User Focus"]
  },
  {
    title: "UX Researcher",
    match: "85%",
    salary: "$85k - $130k",
    growth: "+15% (High)",
    education: "Bachelor's Degree",
    description: "Understand user behaviors and needs to inform design decisions.",
    tags: ["Empathy", "Research", "Design"]
  }
];

export default function Career() {
  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#011f4b]">Career Matches</h1>
        <p className="text-gray-500 mt-2">Based on your interests in math, logic, and problem-solving.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAREERS.map((career, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`border-0 shadow-lg ${idx === 0 ? 'ring-2 ring-[#005b96]' : ''}`}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <Badge className={`mb-2 ${idx === 0 ? 'bg-[#005b96]' : 'bg-gray-500'}`}>
                    {idx === 0 ? 'Top Match' : `${career.match} Match`}
                  </Badge>
                  <CardTitle className="text-xl font-bold text-[#011f4b]">{career.title}</CardTitle>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-[#005b96]" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">{career.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <DollarSign className="h-4 w-4 mx-auto text-green-600 mb-1" />
                    <span className="font-semibold text-gray-700 block">{career.salary}</span>
                    <span className="text-xs text-gray-400">Salary</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <TrendingUp className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <span className="font-semibold text-gray-700 block">{career.growth}</span>
                    <span className="text-xs text-gray-400">Growth</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <Book className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                    <span className="font-semibold text-gray-700 block">Required</span>
                    <span className="text-xs text-gray-400">{career.education}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {career.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">#{tag}</span>
                  ))}
                </div>

                <Button className="w-full bg-[#005b96] hover:bg-[#03396c]">Explore Pathway</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
