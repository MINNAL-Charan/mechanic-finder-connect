
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";

const MapPlaceholder = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Map Integration",
      description: "In a production app, this would be an interactive map using Google Maps or Mapbox API.",
    });
  }, []);
  
  return (
    <div className="relative w-full h-[400px] md:h-[600px] bg-muted flex items-center justify-center rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" fill="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="absolute left-1/4 top-1/3 animate-pulse">
        <div className="relative">
          <MapPin className="h-10 w-10 text-primary" />
          <span className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground text-xs px-1 rounded-full">2</span>
        </div>
      </div>
      
      <div className="absolute right-1/3 bottom-1/3 animate-pulse">
        <div className="relative">
          <MapPin className="h-10 w-10 text-primary" />
          <span className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground text-xs px-1 rounded-full">3</span>
        </div>
      </div>
      
      <div className="absolute left-1/2 top-1/2 animate-pulse">
        <div className="relative">
          <MapPin className="h-12 w-12 text-secondary" />
          <span className="absolute -bottom-2 -right-2 bg-secondary text-secondary-foreground text-xs px-1 rounded-full">You</span>
        </div>
      </div>
      
      <div className="absolute z-10 text-center">
        <p className="text-lg font-medium mb-2">Interactive Map</p>
        <p className="text-sm text-muted-foreground max-w-xs">The actual implementation would use Google Maps or Mapbox API integrated with location services.</p>
      </div>
    </div>
  );
};

// Mock data
const nearbyResults = [
  {
    id: 1,
    name: "John Smith",
    type: "mechanic",
    specialization: "Engine Specialist",
    distance: "1.2 miles",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "City Auto Repair",
    type: "shop",
    specialization: "Full Service Shop",
    distance: "1.5 miles",
    rating: 4.7,
    reviews: 213,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    type: "mechanic",
    specialization: "Transmission Expert",
    distance: "2.5 miles",
    rating: 4.6,
    reviews: 98,
  },
  {
    id: 4,
    name: "Express Mechanic",
    type: "shop",
    specialization: "Quick Service",
    distance: "2.8 miles",
    rating: 4.5,
    reviews: 178,
  },
];

const Location = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(nearbyResults);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          toast({
            title: "Location access granted",
            description: "Showing mechanics and shops near you",
          });
        },
        (error) => {
          setLocationPermission(false);
          toast({
            title: "Location access denied",
            description: "Please enable location services to find nearby mechanics",
            variant: "destructive",
          });
        }
      );
    } else {
      setLocationPermission(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter results based on search term
    const filtered = nearbyResults.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className={`container max-w-7xl mx-auto px-4 pb-20 ${isMobile ? 'pt-4' : 'pt-20'}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 order-2 lg:order-1 space-y-4">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                  <Input
                    placeholder="Search mechanics or services"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="ghost">
                    <Search className="h-5 w-5" />
                  </Button>
                </form>
                
                <Tabs defaultValue="nearby" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="nearby">Nearby</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="nearby" className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {results.length > 0 ? (
                      results.map((item) => (
                        <Card key={item.id} className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-xs text-muted-foreground">{item.specialization}</p>
                            </div>
                            <Badge variant={item.type === "mechanic" ? "default" : "secondary"}>
                              {item.type === "mechanic" ? "Mechanic" : "Shop"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-xs">
                              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{item.distance}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                              <span>{item.rating}</span>
                              <span className="text-muted-foreground ml-1">({item.reviews})</span>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No results found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="recommended" className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {nearbyResults
                      .sort((a, b) => b.rating - a.rating)
                      .map((item) => (
                        <Card key={item.id} className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-xs text-muted-foreground">{item.specialization}</p>
                            </div>
                            <Badge variant={item.type === "mechanic" ? "default" : "secondary"}>
                              {item.type === "mechanic" ? "Mechanic" : "Shop"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-xs">
                              <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span>{item.distance}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                              <span>{item.rating}</span>
                              <span className="text-muted-foreground ml-1">({item.reviews})</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 order-1 lg:order-2">
          {locationPermission === false ? (
            <Card className="p-6 flex flex-col items-center justify-center h-[400px] text-center">
              <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">Location Access Required</h2>
              <p className="text-muted-foreground mb-4 max-w-md">
                We need access to your location to show you mechanics and repair shops near you.
              </p>
              <Button onClick={requestLocationPermission}>
                Enable Location Access
              </Button>
            </Card>
          ) : (
            <MapPlaceholder />
          )}
        </div>
      </div>
    </div>
  );
};

export default Location;
