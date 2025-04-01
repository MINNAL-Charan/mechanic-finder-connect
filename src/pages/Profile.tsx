
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Phone, Mail, LogOut, Calendar, Clock, Car } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock bookings data
const bookingsData = [
  {
    id: 1,
    mechanicName: "John Smith",
    service: "Oil Change & Inspection",
    date: "2023-09-15",
    time: "10:00 AM",
    status: "completed",
    location: "City Auto Repair",
    vehicle: "Toyota Camry 2018",
  },
  {
    id: 2,
    mechanicName: "Sarah Johnson",
    service: "Brake Pad Replacement",
    date: "2023-10-05",
    time: "2:30 PM",
    status: "upcoming",
    location: "Express Mechanic",
    vehicle: "Toyota Camry 2018",
  },
];

const Profile = () => {
  const { user, logout, updateProfile, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const handleSaveProfile = () => {
    updateProfile({
      name,
      email,
      phone,
      location,
    });
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`container max-w-7xl mx-auto px-4 pb-20 ${isMobile ? 'pt-4' : 'pt-20'}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt={name} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{name}</CardTitle>
              <CardDescription>Member since September 2023</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full"
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{phone || "Add phone number"}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{location || "Add location"}</span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div className="w-full lg:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>View and manage your mechanic appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {bookingsData
                    .filter(booking => booking.status === "upcoming")
                    .map(booking => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-lg">{booking.service}</h3>
                              <p className="text-sm">with {booking.mechanicName}</p>
                            </div>
                            <Badge variant="outline" className="bg-accent/20 text-accent-foreground border-accent/20">
                              Upcoming
                            </Badge>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.vehicle}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Reschedule</Button>
                            <Button variant="destructive">Cancel</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {bookingsData.filter(booking => booking.status === "upcoming").length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                      <p className="text-muted-foreground mb-4">You don't have any scheduled appointments</p>
                      <Button onClick={() => navigate("/")}>Find a Mechanic</Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4">
                  {bookingsData
                    .filter(booking => booking.status === "completed")
                    .map(booking => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-lg">{booking.service}</h3>
                              <p className="text-sm">with {booking.mechanicName}</p>
                            </div>
                            <Badge variant="outline" className="bg-muted text-muted-foreground">
                              Completed
                            </Badge>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.vehicle}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4">
                            <Button>Leave Review</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {bookingsData.filter(booking => booking.status === "completed").length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                      <p className="text-muted-foreground">Your completed appointments will show here</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
