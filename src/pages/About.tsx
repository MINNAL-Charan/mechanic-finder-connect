
import { 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Wrench 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <section className="mb-12">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About ChennaiMechanics</h1>
          <div className="w-20 h-1 bg-primary mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Your trusted partner for vehicle maintenance and repair services in Chennai.
            We connect you with skilled mechanics for all your automotive needs.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            At ChennaiMechanics, we're committed to simplifying vehicle maintenance for everyone. 
            Our platform connects vehicle owners with skilled mechanics, offering transparent, 
            reliable, and convenient service options.
          </p>
          <p className="text-muted-foreground mb-4">
            We believe in making quality automotive care accessible to all, whether you need 
            emergency repairs, routine maintenance, or specialized services.
          </p>
          <div className="mt-4">
            <Link to="/location">
              <Button className="mr-4">Find a Mechanic</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline">Join Our Network</Button>
            </Link>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-6 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <Users className="mr-3 text-primary mt-1" />
              <div>
                <span className="font-medium">Qualified Mechanics</span>
                <p className="text-sm text-muted-foreground">All mechanics in our network are vetted and certified</p>
              </div>
            </li>
            <li className="flex items-start">
              <Award className="mr-3 text-primary mt-1" />
              <div>
                <span className="font-medium">Quality Service</span>
                <p className="text-sm text-muted-foreground">Consistently high standards across all service providers</p>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="mr-3 text-primary mt-1" />
              <div>
                <span className="font-medium">Convenient Booking</span>
                <p className="text-sm text-muted-foreground">Easy online scheduling that works around your time</p>
              </div>
            </li>
            <li className="flex items-start">
              <MapPin className="mr-3 text-primary mt-1" />
              <div>
                <span className="font-medium">Location-Based</span>
                <p className="text-sm text-muted-foreground">Find mechanics near you with our interactive map</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4">
              <Wrench className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">General Repairs</h3>
            <p className="text-muted-foreground text-sm">
              From minor fixes to major repairs, our mechanics can handle it all.
            </p>
          </div>
          <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4">
              <Wrench className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Routine Maintenance</h3>
            <p className="text-muted-foreground text-sm">
              Keep your vehicle in top condition with regular check-ups and maintenance.
            </p>
          </div>
          <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 rounded-full p-4 mb-4">
              <Wrench className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Emergency Services</h3>
            <p className="text-muted-foreground text-sm">
              Quick response when you need it most with our emergency breakdown service.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
        <div className="max-w-3xl mx-auto bg-muted rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Get in Touch</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <MapPin className="mr-3 text-primary" />
                  <span>123 Mechanic Street, Chennai, Tamil Nadu</span>
                </li>
                <li className="flex items-center">
                  <PhoneCall className="mr-3 text-primary" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-3 text-primary" />
                  <span>support@chennaimechanics.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
