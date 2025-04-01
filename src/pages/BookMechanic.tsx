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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addDays, isBefore, startOfToday } from "date-fns";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Phone, Star, CheckCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
    image: "https://images.unsplash.com/photo-1601942211434-27c53cc85e7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackInitials: "JS",
    hourlyRate: "₹800",
    services: ["Engine Diagnostics", "Engine Repair", "Timing Belt Replacement", "Oil Change"]
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
    image: "https://images.unsplash.com/photo-1525828024186-5294af6c926d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackInitials: "SJ",
    hourlyRate: "₹750",
    services: ["Transmission Diagnostics", "Transmission Repair", "Clutch Replacement", "Fluid Change"]
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
    image: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackInitials: "MR",
    hourlyRate: "₹850",
    services: ["Brake Inspection", "Brake Pad Replacement", "Caliper Repair", "Brake Fluid Flush"]
  },
  {
    id: 4,
    name: "Anitha Kumar",
    specialization: "Electrical Systems",
    rating: 4.7,
    reviews: 113,
    distance: "0.8",
    availability: "Available Now",
    phone: "555-222-3333",
    image: "",
    fallbackInitials: "AK",
    hourlyRate: "₹900",
    services: ["Electrical Diagnostics", "Battery Service", "Alternator Repair", "Starter Motor Replacement"]
  },
  {
    id: 5,
    name: "Raj Patel",
    specialization: "AC Repair Expert",
    rating: 4.5,
    reviews: 87,
    distance: "1.9",
    availability: "Available in 3 hours",
    phone: "555-444-5555",
    image: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&h=768&q=80",
    fallbackInitials: "RP",
    hourlyRate: "₹780",
    services: ["AC Diagnostics", "AC Recharge", "Compressor Replacement", "Evaporator Repair"]
  }
];

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
  vehicleDetails: z.string().min(3, "Please provide details about your vehicle"),
  issueDescription: z.string().min(10, "Please describe the issue in more detail").max(500, "Description too long"),
  contactNumber: z.string().min(10, "Please enter a valid contact number"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookMechanic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingFormValues | null>(null);

  const selectedMechanic = mechanicsData.find(mechanic => mechanic.id === Number(id));

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
    },
  });

  if (!selectedMechanic) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mechanic Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the mechanic you're looking for.</p>
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
      description: "Your booking request has been sent to the mechanic.",
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
        Back to Mechanics
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">Mechanic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {selectedMechanic.image ? (
                  <img 
                    src={selectedMechanic.image} 
                    alt={selectedMechanic.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary text-xl font-bold">
                    {selectedMechanic.fallbackInitials}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{selectedMechanic.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMechanic.specialization}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{selectedMechanic.rating}</span>
                <span className="text-muted-foreground text-sm">({selectedMechanic.reviews} reviews)</span>
              </div>
              
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedMechanic.distance} miles away</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedMechanic.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedMechanic.availability}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <p className="font-medium">Hourly Rate</p>
                <p className="text-lg font-bold text-primary">{selectedMechanic.hourlyRate}</p>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-2">Services Offered</p>
                <ul className="space-y-1">
                  {selectedMechanic.services.map((service, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment with {selectedMechanic.name}</CardTitle>
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => 
                                  isBefore(date, startOfToday()) || 
                                  isBefore(addDays(startOfToday(), 30), date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                            <FormLabel>Service Required</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectedMechanic.services.map((service) => (
                                  <SelectItem key={service} value={service}>
                                    {service}
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
                  
                  <Button type="submit" className="w-full">Book Appointment</Button>
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
              Your appointment with <span className="font-semibold">{selectedMechanic.name}</span> has been booked.
            </p>
            {bookingDetails && (
              <div className="text-sm text-muted-foreground mt-4 text-left bg-muted p-4 rounded-md">
                <p><span className="font-medium">Date:</span> {format(bookingDetails.date, "MMMM d, yyyy")}</p>
                <p><span className="font-medium">Time:</span> {bookingDetails.time}</p>
                <p><span className="font-medium">Service:</span> {bookingDetails.service}</p>
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

export default BookMechanic;
