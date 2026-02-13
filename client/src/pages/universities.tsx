import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Heart, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { UNIVERSITIES } from "@/data/universities";
import { useStore } from "@/lib/store";

export default function Universities() {
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [maxTuition, setMaxTuition] = useState("");
  const [maxAcceptance, setMaxAcceptance] = useState("");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [, setLocation] = useLocation();
  const { savedUniversities, toggleSavedUniversity } = useStore();
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedLocation = locationFilter.trim().toLowerCase();
  const normalizedTag = tagFilter.trim().toLowerCase();
  const tuitionLimit = maxTuition ? Number(maxTuition) : undefined;
  const acceptanceLimit = maxAcceptance ? Number(maxAcceptance) : undefined;

  const parseTuition = (value: string) => Number(value.replace(/[^0-9]/g, ""));
  const parseAcceptance = (value: string) => Number(value.replace("%", ""));

  const filtered = UNIVERSITIES.filter((u) =>
    (u.name.toLowerCase().includes(normalizedSearch) ||
      u.tags.some((t) => t.toLowerCase().includes(normalizedSearch))) &&
    (!normalizedLocation || u.location.toLowerCase().includes(normalizedLocation)) &&
    (!normalizedTag || u.tags.some((tag) => tag.toLowerCase().includes(normalizedTag))) &&
    (!tuitionLimit || parseTuition(u.details.tuition) <= tuitionLimit) &&
    (!acceptanceLimit || parseAcceptance(u.details.acceptanceRate) <= acceptanceLimit)
  );

  const compared = UNIVERSITIES.filter((u) => compareIds.includes(u.id));

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!normalizedSearch) {
      setSearchError("Please fill in the search field.");
      return;
    }
    setSearchError("");
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      setSearchError("");
    }
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((entry) => entry !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-[#011f4b]">Explore Universities</h1>
          <p className="text-gray-500 mt-2">Find institutions that align with your profile and interests.</p>
        </div>
        <form className="w-full md:w-1/3" onSubmit={handleSearchSubmit} noValidate>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or tag..."
              className="pl-10 pr-24 bg-white border-slate-200"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-invalid={Boolean(searchError)}
            />
            <Button
              type="submit"
              className="absolute right-1 top-1 h-8 px-3 bg-[#005b96] hover:bg-[#03396c] text-white"
            >
              Search
            </Button>
          </div>
          {searchError && <p className="mt-2 text-sm text-red-600">{searchError}</p>}
        </form>
      </header>

      <Card className="mb-6 border border-slate-200">
        <CardContent className="p-4 grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
          />
          <Input
            placeholder="Filter by tag..."
            value={tagFilter}
            onChange={(event) => setTagFilter(event.target.value)}
          />
          <Input
            type="number"
            placeholder="Max tuition (USD)"
            value={maxTuition}
            onChange={(event) => setMaxTuition(event.target.value)}
          />
          <Input
            type="number"
            placeholder="Max acceptance %"
            value={maxAcceptance}
            onChange={(event) => setMaxAcceptance(event.target.value)}
          />
        </CardContent>
      </Card>

      {compared.length > 0 && (
        <Card className="mb-6 border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#011f4b] flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#005b96]" />
                Compare Universities ({compared.length}/3)
              </h2>
              <Button variant="outline" size="sm" onClick={() => setCompareIds([])}>
                Clear Compare
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {compared.map((uni) => (
                <div key={uni.id} className="rounded-lg border border-slate-200 p-3 bg-white">
                  <p className="font-semibold text-[#03396c]">{uni.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{uni.location}</p>
                  <p className="text-xs mt-2">Acceptance: {uni.details.acceptanceRate}</p>
                  <p className="text-xs">Tuition: {uni.details.tuition}</p>
                  <p className="text-xs mt-1 text-gray-700">Top Programs: {uni.details.topPrograms}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                  {uni.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-[#b3cde0]/30 text-[#03396c] hover:bg-[#b3cde0]/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <div className="w-full space-y-2">
                  <Button
                    onClick={() => setLocation(`/universities/${uni.id}`)}
                    className="w-full bg-white text-[#005b96] border border-[#005b96] hover:bg-[#005b96] hover:text-white transition-colors"
                  >
                    View Details
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={`${
                        savedUniversities.includes(uni.id) ? "border-red-300 text-red-600" : ""
                      }`}
                      onClick={() => toggleSavedUniversity(uni.id)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {savedUniversities.includes(uni.id) ? "Saved" : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCompare(uni.id)}
                      disabled={!compareIds.includes(uni.id) && compareIds.length >= 3}
                    >
                      <Scale className="h-4 w-4 mr-1" />
                      {compareIds.includes(uni.id) ? "Compared" : "Compare"}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
