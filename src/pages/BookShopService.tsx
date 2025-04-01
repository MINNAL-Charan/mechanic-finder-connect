
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Phone, Star, CheckCircle, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    image: "https://images.unsplash.com/photo-1606611013551-d1e756e4938a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackText: "CAR",
    serviceDetails: [
      { name: "Oil Change", price: "₹800", duration: "30 min" },
      { name: "Brake Service", price: "₹2,500", duration: "2 hours" },
      { name: "Engine Repair", price: "₹5,000+", duration: "4+ hours" },
      { name: "Wheel Alignment", price: "₹1,500", duration: "1 hour" },
      { name: "Car Inspection", price: "₹1,200", duration: "1 hour" }
    ],
    amenities: ["Waiting Room", "Free Wi-Fi", "Coffee", "Shuttle Service"]
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
    image: "https://images.unsplash.com/photo-1630588605887-d4e1e88fb606?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackText: "EM",
    serviceDetails: [
      { name: "Tire Service", price: "₹600/tire", duration: "45 min" },
      { name: "AC Repair", price: "₹3,000+", duration: "2-3 hours" },
      { name: "Diagnostics", price: "₹1,000", duration: "1 hour" },
      { name: "Battery Replacement", price: "₹4,500", duration: "30 min" },
      { name: "Headlight Replacement", price: "₹1,200", duration: "45 min" }
    ],
    amenities: ["Waiting Room", "Free Wi-Fi", "Pickup Service", "24/7 Support"]
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
    image: "",
    fallbackText: "PAC",
    serviceDetails: [
      { name: "Full Service", price: "₹7,000", duration: "3-4 hours" },
      { name: "Body Work", price: "₹10,000+", duration: "1-5 days" },
      { name: "Transmission", price: "₹15,000+", duration: "1-2 days" },
      { name: "Interior Detailing", price: "₹4,500", duration: "4 hours" },
      { name: "Paint Protection", price: "₹12,000", duration: "1 day" }
    ],
    amenities: ["Luxury Waiting Room", "Free Wi-Fi", "Complimentary Drinks", "Loaner Cars", "Pickup & Delivery"]
  },
  {
    id: 4,
    name: "Chennai Motors",
    services: ["Oil Change", "Engine Tune-up", "Wheel Alignment"],
    rating: 4.6,
    reviews: 154,
    distance: "3.7",
    openHours: "9AM - 5PM",
    phone: "555-777-8888",
    image: "https://images.unsplash.com/photo-1487252665478-49b61b47f302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackText: "CM",
    serviceDetails: [
      { name: "Oil Change", price: "₹750", duration: "30 min" },
      { name: "Engine Tune-up", price: "₹3,500", duration: "2 hours" },
      { name: "Wheel Alignment", price: "₹1,600", duration: "1 hour" },
      { name: "Fuel System Cleaning", price: "₹2,200", duration: "1.5 hours" },
      { name: "Spark Plug Replacement", price: "₹1,800", duration: "1 hour" }
    ],
    amenities: ["Waiting Area", "Local Shops Nearby", "Free Inspection"]
  },
  {
    id: 5,
    name: "T. Nagar Auto Works",
    services: ["Battery Service", "Suspension Repair", "Brake Repair"],
    rating: 4.3,
    reviews: 98,
    distance: "5.1",
    openHours: "8:30AM - 6:30PM",
    phone: "555-999-0000",
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackText: "TNAW",
    serviceDetails: [
      { name: "Battery Service", price: "₹500", duration: "30 min" },
      { name: "Suspension Repair", price: "₹4,000+", duration: "3-5 hours" },
      { name: "Brake Repair", price: "₹2,000+", duration: "1-2 hours" },
      { name: "Exhaust System Repair", price: "₹3,000+", duration: "2-3 hours" },
      { name: "Radiator Flush", price: "₹1,500", duration: "1 hour" }
    ],
    amenities: ["Waiting Room", "Tea/Coffee", "TV", "Children's Area"]
  }
];

// Form schema for booking shop service
const bookingFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your appointment",
  }),
  time: z.string({
    required_error: "Please select a time slot",
  }),
  service: z.string({
    required_error: "Please select a service",
  }),
  additionalServices: z.array(z.string()).optional(),
  vehicleDetails: z.string().min(3, "Please provide details about your vehicle"),
  issueDescription: z.string().min(10, "Please describe the issue in more detail").max(500, "Description too long"),
  contactNumber: z.string().min(10, "Please enter a valid contact number"),
  pickupRequired: z.boolean().default(false),
  pickupAddress: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookShopService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingFormValues | null>(null);

  // Find the selected shop from our data
  const selectedShop = shopsData.find(shop => shop.id === Number(id));

  // Available time slots
  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      vehicleDetails: "",
      issueDescription: "",
      contactNumber: "",
      pickupRequired: false,
      pickupAddress: "",
      additionalServices: [],
    },
  });

  const watchPickupRequired = form.watch("pickupRequired");
  const watchSelectedService = form.watch("service");

  if (!selectedShop) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Repair Shop Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the repair shop you're looking for.</p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: BookingFormValues) => {
    console.log("Booking submitted:", data);
    setBookingDetails(data);
    setSuccessDialogOpen(true);
    toast({
      title: "Booking request sent!",
      description: "Your service booking request has been sent to the shop.",
    });
  };

  const handleBackToHome = () => {
    setSuccessDialogOpen(false);
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:pt-20 pb-20">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Repair Shops
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Repair Shop Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedShop.image ? (
                  <img 
                    src={selectedShop.image} 
                    alt={selectedShop.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary text-xl font-bold">
                    {selectedShop.fallbackText}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{selectedShop.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{selectedShop.rating}</span>
                    <span className="text-muted-foreground text-sm">({selectedShop.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedShop.distance} miles away</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedShop.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedShop.openHours}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Available Services</p>
                <div className="space-y-3">
                  {selectedShop.serviceDetails.map((service, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <Wrench className="h-4 w-4 text-primary shrink-0 mt-1" />
                        <div>
                          <p className="text-sm font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.duration}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedShop.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book Service at {selectedShop.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              isBefore(date, startOfToday()) || 
                              isBefore(addDays(startOfToday(), 30), date)
                            }
                            className="rounded-md border"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Slot</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a time slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Service</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedShop.serviceDetails.map((service) => (
                                  <SelectItem key={service.name} value={service.name}>
                                    {service.name} - {service.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {watchSelectedService && (
                    <FormField
                      control={form.control}
                      name="additionalServices"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Additional Services (Optional)</FormLabel>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedShop.serviceDetails
                              .filter(service => service.name !== watchSelectedService)
                              .map((service) => (
                                <FormField
                                  key={service.name}
                                  control={form.control}
                                  name="additionalServices"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={service.name}
                                        className="flex flex-row items-start space-x-3 space-y-0 border rounded-md p-3"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(service.name)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value || [], service.name])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== service.name
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <div className="flex justify-between w-full">
                                          <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-medium">
                                              {service.name}
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                              {service.duration}
                                            </p>
                                          </div>
                                          <p className="text-sm font-medium">{service.price}</p>
                                        </div>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="vehicleDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Details</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., 2019 Honda City, Diesel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="issueDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe the Issue</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe the issue you're experiencing with your vehicle" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pickupRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I need pickup service
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            We'll arrange to pick up your vehicle from your location
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {watchPickupRequired && (
                    <FormField
                      control={form.control}
                      name="pickupAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your complete address for vehicle pickup" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <Button type="submit" className="w-full">Book Service</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Booking Successful!</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <p className="mb-2">
              Your service with <span className="font-semibold">{selectedShop.name}</span> has been booked.
            </p>
            {bookingDetails && (
              <div className="text-sm text-muted-foreground mt-4 text-left bg-muted p-4 rounded-md">
                <p><span className="font-medium">Date:</span> {format(bookingDetails.date, "MMMM d, yyyy")}</p>
                <p><span className="font-medium">Time:</span> {bookingDetails.time}</p>
                <p><span className="font-medium">Service:</span> {bookingDetails.service}</p>
                {bookingDetails.pickupRequired && (
                  <p><span className="font-medium">Pickup:</span> Required</p>
                )}
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              You will receive a confirmation SMS shortly.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleBackToHome} className="w-full">Return to Home</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookShopService;
