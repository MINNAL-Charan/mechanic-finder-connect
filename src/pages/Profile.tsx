
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, Wrench, MapPin, Phone, Settings, LogOut, Star, Trash, Book, Review } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";
import { useVehicles } from "@/hooks/useVehicles";
import { useBookings } from "@/hooks/useBookings";
import { useProfile } from "@/hooks/useProfile";

const Profile = () => {
  const { user, isLoggedIn, logout, updateProfile, reloadProfile, isLoading } = useAuth();
  const { profile, refetch } = useProfile();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bookings");
  const { vehicles, addVehicle, removeVehicle } = useVehicles();
  const { bookings, cancelBooking } = useBookings();
  const [editMode, setEditMode] = useState(false);
  const [profileInput, setProfileInput] = useState({
    name: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    if (profile) {
      setProfileInput({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
    }
  }, [isLoggedIn, navigate, profile]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileInput);
    setEditMode(false);
    await refetch();
  };

  const handleAddVehicle = async () => {
    const model = prompt("Vehicle model?");
    const year = prompt("Year?");
    const license_plate = prompt("License Plate?");
    if (model && year && license_plate) {
      await addVehicle.mutateAsync({ model, year, license_plate });
      toast({ title: "Vehicle added" });
    }
  };

  const handleRemoveVehicle = async (vehicleId: string) => {
    if (window.confirm("Are you sure you want to remove this vehicle?")) {
      await removeVehicle.mutateAsync(vehicleId);
      toast({ title: "Vehicle removed" });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      await cancelBooking.mutateAsync(bookingId);
      toast({ title: "Booking cancelled" });
    }
  };

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
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
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">{user.location || "Chennai"}</Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">Premium Member</Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setEditMode((v) => !v)}>
                <Settings className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
          {editMode && (
            <form onSubmit={handleProfileUpdate} className="mt-6 bg-white/10 rounded p-4 flex gap-2 flex-wrap items-end">
              <input
                type="text"
                placeholder="Name"
                value={profileInput.name}
                className="rounded p-2 bg-white/20 text-white"
                onChange={e => setProfileInput(v => ({ ...v, name: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Phone"
                value={profileInput.phone}
                className="rounded p-2 bg-white/20 text-white"
                onChange={e => setProfileInput(v => ({ ...v, phone: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Location"
                value={profileInput.location}
                className="rounded p-2 bg-white/20 text-white"
                onChange={e => setProfileInput(v => ({ ...v, location: e.target.value }))}
              />
              <Button type="submit" size="sm" disabled={isLoading}>Save</Button>
            </form>
          )}
        </div>
        
        <Tabs defaultValue="bookings" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bookings">Service Bookings</TabsTrigger>
            <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <Card key={booking.id} className="overflow-hidden card-hover">
                  <div className="flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <CardTitle className="flex items-center">
                            <Wrench className="h-5 w-5 mr-2 text-primary" />
                            {booking.mechanic_name}
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
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{booking.date && new Date(booking.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
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
                        <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</Button>
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
                  <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-xl font-medium mb-2">No bookings yet</p>
                  <p className="text-muted-foreground mb-6">You haven't made any service bookings yet.</p>
                  <Button onClick={() => navigate("/")}>Find Mechanics</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-4">
            {vehicles.map((vehicle: any) => (
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
                      <Badge variant="secondary">{vehicle.license_plate}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm">
                      <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Last serviced: {vehicle.last_service ? new Date(vehicle.last_service).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm">View Service History</Button>
                    <Button size="sm" onClick={() => handleRemoveVehicle(vehicle.id)} variant="destructive">
                      <Trash className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={handleAddVehicle}>
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
