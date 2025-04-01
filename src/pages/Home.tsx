
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for mechanics
const mechanicsData = [
  {
    id: 1,
    name: "John Smith",
    specialization: "Engine Specialist",
    rating: 4.8,
    reviews: 124,
    distance: "1.2",
    availability: "Available Now",
    phone: "555-123-4567",
    image: "https://images.unsplash.com/photo-1601942211434-27c53cc85e7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    specialization: "Transmission Expert",
    rating: 4.6,
    reviews: 98,
    distance: "2.5",
    availability: "Available in 2 hours",
    phone: "555-987-6543",
    image: "https://images.unsplash.com/photo-1525828024186-5294af6c926d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80"
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    specialization: "Brake Specialist",
    rating: 4.9,
    reviews: 156,
    distance: "3.1",
    availability: "Available Tomorrow",
    phone: "555-456-7890",
    image: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80"
  }
];

// Mock data for mechanic shops
const shopsData = [
  {
    id: 1,
    name: "City Auto Repair",
    services: ["Oil Change", "Brake Service", "Engine Repair"],
    rating: 4.7,
    reviews: 213,
    distance: "1.5",
    openHours: "8AM - 6PM",
    phone: "555-111-2222",
    image: "https://images.unsplash.com/photo-1606611013551-d1e756e4938a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80"
  },
  {
    id: 2,
    name: "Express Mechanic",
    services: ["Tire Service", "AC Repair", "Diagnostics"],
    rating: 4.5,
    reviews: 178,
    distance: "2.8",
    openHours: "7AM - 8PM",
    phone: "555-333-4444",
    image: "https://images.unsplash.com/photo-1630588605887-d4e1e88fb606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80"
  },
  {
    id: 3,
    name: "Premium Auto Care",
    services: ["Full Service", "Body Work", "Transmission"],
    rating: 4.9,
    reviews: 325,
    distance: "4.2",
    openHours: "8AM - 7PM",
    phone: "555-555-6666",
    image: "https://images.unsplash.com/photo-1567429934742-a9e7e43c1bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80"
  }
];

const Home = () => {
  const { isLoggedIn, user } = useAuth();
  const [activeTab, setActiveTab] = useState("mechanics");
  const isMobile = useIsMobile();

  return (
    <div className="container max-w-7xl mx-auto px-4 pb-20 md:py-8">
      <div className={`pt-6 pb-4 ${isMobile ? 'mt-0' : 'mt-16'}`}>
        <h1 className="text-3xl font-bold mb-2">
          {isLoggedIn 
            ? `Welcome back, ${user?.name?.split(' ')[0] || 'User'}` 
            : "Find mechanics near you"}
        </h1>
        <p className="text-muted-foreground">
          Connect with trusted mechanics and auto repair shops in your area
        </p>
      </div>

      <Tabs defaultValue="mechanics" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
          <TabsTrigger value="shops">Repair Shops</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mechanics" className="space-y-4">
          {mechanicsData.map((mechanic) => (
            <Card key={mechanic.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                  <img 
                    src={mechanic.image} 
                    alt={mechanic.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{mechanic.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{mechanic.specialization}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="font-medium">{mechanic.rating}</span>
                        <span className="text-muted-foreground text-sm ml-1">({mechanic.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{mechanic.distance} miles away</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{mechanic.availability}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{mechanic.phone}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={mechanic.availability.includes("Available Now") ? "outline" : "secondary"}
                      className={mechanic.availability.includes("Available Now") ? "bg-accent/20 hover:bg-accent/30 text-accent-foreground border-accent/20" : ""}
                    >
                      {mechanic.availability}
                    </Badge>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Profile</Button>
                    <Link to={isLoggedIn ? `/booking/${mechanic.id}` : "/login"}>
                      <Button>{isLoggedIn ? "Book Now" : "Login to Book"}</Button>
                    </Link>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
          <div className="flex justify-center mt-6">
            <Link to="/location">
              <Button variant="outline" className="w-full md:w-auto">View Map</Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="shops" className="space-y-4">
          {shopsData.map((shop) => (
            <Card key={shop.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 h-48 md:h-auto relative">
                  <img 
                    src={shop.image} 
                    alt={shop.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{shop.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {shop.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="font-medium">{shop.rating}</span>
                        <span className="text-muted-foreground text-sm ml-1">({shop.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{shop.distance} miles away</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{shop.openHours}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{shop.phone}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Link to={isLoggedIn ? `/booking/shop/${shop.id}` : "/login"}>
                      <Button>{isLoggedIn ? "Book Service" : "Login to Book"}</Button>
                    </Link>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
          <div className="flex justify-center mt-6">
            <Link to="/location">
              <Button variant="outline" className="w-full md:w-auto">View Map</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
