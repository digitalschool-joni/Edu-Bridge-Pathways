import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UNIVERSITIES } from "@/data/universities";
import { Link, useRoute } from "wouter";
import { MapPin, Users, Award, ExternalLink, GraduationCap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";

const CHECKLIST_ITEMS = [
  "Review admission requirements",
  "Prepare personal statement draft",
  "Request recommendation letters",
  "Collect transcripts and scores",
  "Submit application before deadline",
];

export default function UniversityDetail() {
  const [, params] = useRoute("/universities/:id");
  const id = Number(params?.id);
  const uni = UNIVERSITIES.find((item) => item.id === id);
  const { universityChecklist, toggleUniversityChecklistItem } = useStore();
  const completedItems = universityChecklist[String(id)] ?? [];
  const completionPercent = Math.round((completedItems.length / CHECKLIST_ITEMS.length) * 100);

  if (!uni) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h2 className="text-2xl font-display font-bold text-[#011f4b] mb-3">University Not Found</h2>
          <p className="text-gray-500 mb-6">We could not find that university.</p>
          <Button asChild className="bg-[#005b96] hover:bg-[#03396c]">
            <Link href="/universities">Back to Universities</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button asChild variant="ghost" className="text-[#005b96]">
          <Link href="/universities">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Universities
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-64 bg-gray-200 relative">
              <img src={uni.image} alt={uni.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {uni.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-[#b3cde0]/30 text-[#03396c]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-display font-bold text-[#011f4b]">{uni.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                {uni.location}
              </div>
              <p className="text-gray-600 mt-4 leading-relaxed">{uni.details.summary}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[#011f4b]">Key Details</h2>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[#005b96]" />
                <div>
                  <p className="text-xs text-slate-500">Acceptance Rate</p>
                  <p className="font-semibold">{uni.details.acceptanceRate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-[#005b96]" />
                <div>
                  <p className="text-xs text-slate-500">Tuition</p>
                  <p className="font-semibold">{uni.details.tuition}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="h-5 w-5 text-[#005b96]" />
                <div>
                  <p className="text-xs text-slate-500">Top Programs</p>
                  <p className="font-semibold">{uni.details.topPrograms}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-[#005b96]" />
                <div>
                  <p className="text-xs text-slate-500">Campus Vibe</p>
                  <p className="font-semibold">{uni.details.campusVibe}</p>
                </div>
              </div>
              <Button className="w-full bg-[#005b96] hover:bg-[#03396c]">Request Info Packet</Button>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50">
                <p className="text-sm font-semibold text-[#011f4b] mb-2">
                  Application Checklist ({completionPercent}% complete)
                </p>
                <div className="space-y-2">
                  {CHECKLIST_ITEMS.map((item) => {
                    const done = completedItems.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className={`w-full text-left text-sm rounded-md border px-2 py-1 transition-colors ${
                          done
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                        onClick={() => toggleUniversityChecklistItem(id, item)}
                      >
                        {done ? "Done" : "Todo"}: {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
