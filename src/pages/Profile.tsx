import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Car, Clock, Wrench, MapPin, Phone, Settings, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";

const bookingsData = [
  {
    id: 1,
    mechanicName: "John Smith",
    service: "Oil Change",
    status: "Confirmed",
    date: "2023-11-15",
    time: "10:00 AM",
    location: "Chennai Central",
    phone: "555-123-4567",
  },
  {
    id: 2,
    mechanicName: "Sarah Johnson",
    service: "Brake Inspection",
    status: "Completed",
    date: "2023-11-10",
    time: "02:30 PM",
    location: "T. Nagar",
    phone: "555-987-6543",
  },
  {
    id: 3,
    mechanicName: "Express Mechanic",
    service: "Tire Replacement",
    status: "Cancelled",
    date: "2023-11-05",
    time: "09:15 AM",
    location: "Adyar",
    phone: "555-333-4444",
  },
];

const vehiclesData = [
  {
    id: 1,
    model: "Honda City",
    year: "2019",
    licensePlate: "TN 01 AB 1234",
    lastService: "2023-10-20",
  },
  {
    id: 2,
    model: "Maruti Swift",
    year: "2020",
    licensePlate: "TN 02 CD 5678",
    lastService: "2023-09-15",
  },
];

const Profile = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bookings");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 pb-20 md:py-8">
      <div className={`pt-6 pb-4 ${isMobile ? 'mt-0' : 'mt-16'}`}>
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-white mb-6 shadow-md">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white/20">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} />
              <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
              <p className="text-white/80">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">Chennai</Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">Premium Member</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="bookings" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bookings">Service Bookings</TabsTrigger>
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            {bookingsData.length > 0 ? (
              bookingsData.map((booking) => (
                <Card key={booking.id} className="overflow-hidden card-hover">
                  <div className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <CardTitle className="flex items-center">
                            <Wrench className="h-5 w-5 mr-2 text-primary" />
                            {booking.mechanicName}
                          </CardTitle>
                          <CardDescription>{booking.service}</CardDescription>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center text-sm">
                          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{booking.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {booking.status === "Confirmed" && (
                        <Button variant="destructive" size="sm">Cancel Booking</Button>
                      )}
                      {booking.status === "Completed" && (
                        <Button variant="secondary" size="sm">Leave Review</Button>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-xl font-medium mb-2">No bookings yet</p>
                  <p className="text-muted-foreground mb-6">You haven't made any service bookings yet.</p>
                  <Button onClick={() => navigate("/")}>Find Mechanics</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-4">
            {vehiclesData.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden card-hover card-highlight">
                <div className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <Car className="h-5 w-5 mr-2 text-primary" />
                          {vehicle.model}
                        </CardTitle>
                        <CardDescription>Year: {vehicle.year}</CardDescription>
                      </div>
                      <Badge variant="secondary">{vehicle.licensePlate}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm">
                      <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Last serviced: {new Date(vehicle.lastService).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm">View Service History</Button>
                    <Button size="sm">Schedule Service</Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Car className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
