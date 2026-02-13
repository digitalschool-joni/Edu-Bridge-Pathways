import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MessageCircle, Briefcase, GraduationCap } from "lucide-react";

const ALUMNI = [
  { 
    id: 1, 
    name: "Sarah Chen", 
    role: "Senior Data Scientist", 
    company: "Google", 
    uni: "Stanford University",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  { 
    id: 2, 
    name: "Michael Ross", 
    role: "Product Manager", 
    company: "Spotify", 
    uni: "NYU Stern",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  { 
    id: 3, 
    name: "Emily Davis", 
    role: "UX Designer", 
    company: "Airbnb", 
    uni: "RISD",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  },
  { 
    id: 4, 
    name: "James Wilson", 
    role: "Software Engineer", 
    company: "Microsoft", 
    uni: "MIT",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
];

export default function Alumni() {
  const { addMeetingRequest, meetingRequests } = useStore();
  const { toast } = useToast();

  const handleRequest = (alumId: number, name: string) => {
    addMeetingRequest({ alumId, date: new Date().toISOString() });
    toast({
      title: "Request Sent",
      description: `Meeting request sent to ${name}. They will be notified.`,
      duration: 3000,
    });
  };

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-[#011f4b]">Alumni Network</h1>
        <p className="text-gray-500 mt-2">Connect with graduates who are currently working in your dream fields.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALUMNI.map((alum, idx) => {
          const isRequested = meetingRequests.some((r: any) => r.alumId === alum.id);
          
          return (
            <motion.div
              key={alum.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                      <AvatarImage src={alum.image} alt={alum.name} />
                      <AvatarFallback>{alum.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#011f4b]">{alum.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Briefcase className="h-3 w-3 mr-1 text-[#005b96]" />
                        {alum.role} at {alum.company}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="h-3 w-3 mr-1 text-[#005b96]" />
                        Alumni of {alum.uni}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <Button 
                      className={`flex-1 ${isRequested ? 'bg-green-600 hover:bg-green-700' : 'bg-[#005b96] hover:bg-[#03396c]'}`}
                      onClick={() => !isRequested && handleRequest(alum.id, alum.name)}
                      disabled={isRequested}
                    >
                      {isRequested ? 'Request Sent' : 'Request Mentorship'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </Layout>
  );
}
