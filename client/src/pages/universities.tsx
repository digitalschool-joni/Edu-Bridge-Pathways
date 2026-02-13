import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

// Mock Data
const UNIVERSITIES = [
  { id: 1, name: "Tech Institute of Science", location: "Boston, MA", tags: ["STEM", "Research", "Urban"], image: "https://images.unsplash.com/photo-1562774053-701939374585?w=500&h=300&fit=crop" },
  { id: 2, name: "Liberal Arts College", location: "Portland, OR", tags: ["Humanities", "Small Class Sizes", "Creative"], image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=500&h=300&fit=crop" },
  { id: 3, name: "State University", location: "Austin, TX", tags: ["Sports", "Engineering", "Large Campus"], image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=300&fit=crop" },
  { id: 4, name: "Design Academy", location: "New York, NY", tags: ["Arts", "Design", "Studio"], image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=300&fit=crop" },
  { id: 5, name: "Business School of London", location: "London, UK", tags: ["Finance", "Global", "Networking"], image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=300&fit=crop" },
  { id: 6, name: "Pacific Ocean University", location: "San Diego, CA", tags: ["Marine Bio", "Environmental", "Coastal"], image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=500&h=300&fit=crop" },
  { id: 7, name: "Mountain View College", location: "Denver, CO", tags: ["Geology", "Outdoors", "Sustainable"], image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=500&h=300&fit=crop" },
  { id: 8, name: "Historic University", location: "Cambridge, MA", tags: ["Pre-Law", "History", "Elite"], image: "https://images.unsplash.com/photo-1607237138186-7374c52946fe?w=500&h=300&fit=crop" },
];

export default function Universities() {
  const [search, setSearch] = useState("");

  const filtered = UNIVERSITIES.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#011f4b]">Explore Universities</h1>
          <p className="text-gray-500 mt-2">Find institutions that align with your profile and interests.</p>
        </div>
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by name or tag..." 
            className="pl-10 bg-white border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((uni, idx) => (
          <motion.div
            key={uni.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow border-0 shadow-md">
              <div className="h-40 bg-gray-200 relative overflow-hidden">
                {/* Descriptive comment for dynamic image usage */}
                {/* University Campus Image */}
                <img 
                  src={uni.image} 
                  alt={uni.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/90 text-[#011f4b] hover:bg-white">Match: 9{8 - idx}%</Badge>
                </div>
              </div>
              <CardContent className="flex-1 p-5">
                <h3 className="font-bold text-lg text-[#011f4b] mb-1 leading-tight">{uni.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="h-3 w-3 mr-1" />
                  {uni.location}
                </div>
                <div className="flex flex-wrap gap-2">
                  {uni.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-[#b3cde0]/30 text-[#03396c] hover:bg-[#b3cde0]/50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button className="w-full bg-white text-[#005b96] border border-[#005b96] hover:bg-[#005b96] hover:text-white transition-colors">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
