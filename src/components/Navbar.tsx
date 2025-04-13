
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, User, LogIn, Wrench, Info } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-6 md:top-0 md:bottom-auto z-10 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="md:flex items-center hidden">
          <Link to="/" className="flex items-center gap-2" aria-label="ChennaiMechanics Home">
            <Wrench className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold text-primary">ChennaiMechanics</span>
          </Link>
        </div>
        
        <div className="flex justify-between w-full md:w-auto md:gap-2">
          <Link to="/" className="flex flex-col items-center text-xs md:hidden" aria-label="Home">
            <Home className={`h-6 w-6 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
            <span className="mt-1">Home</span>
          </Link>
          
          <Link to="/location" className="flex flex-col items-center text-xs md:hidden" aria-label="Map">
            <MapPin className={`h-6 w-6 ${location.pathname === '/location' ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
            <span className="mt-1">Map</span>
          </Link>
          
          <Link to="/about" className="flex flex-col items-center text-xs md:hidden" aria-label="About">
            <Info className={`h-6 w-6 ${location.pathname === '/about' ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
            <span className="mt-1">About</span>
          </Link>
          
          {isLoggedIn ? (
            <Link to="/profile" className="flex flex-col items-center text-xs md:hidden" aria-label="Profile">
              <User className={`h-6 w-6 ${location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
              <span className="mt-1">Profile</span>
            </Link>
          ) : (
            <Link to="/login" className="flex flex-col items-center text-xs md:hidden" aria-label="Login">
              <LogIn className={`h-6 w-6 ${location.pathname === '/login' ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
              <span className="mt-1">Login</span>
            </Link>
          )}
          
          <div className="hidden md:flex gap-4">
            <Link to="/">
              <Button variant={location.pathname === '/' ? "default" : "ghost"} className="font-medium" aria-current={location.pathname === '/' ? "page" : undefined}>Home</Button>
            </Link>
            <Link to="/location">
              <Button variant={location.pathname === '/location' ? "default" : "ghost"} className="font-medium" aria-current={location.pathname === '/location' ? "page" : undefined}>Find Mechanics</Button>
            </Link>
            <Link to="/about">
              <Button variant={location.pathname === '/about' ? "default" : "ghost"} className="font-medium" aria-current={location.pathname === '/about' ? "page" : undefined}>About Us</Button>
            </Link>
            {isLoggedIn ? (
              <Link to="/profile">
                <Button variant={location.pathname === '/profile' ? "default" : "ghost"} className="font-medium" aria-current={location.pathname === '/profile' ? "page" : undefined}>Profile</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant={location.pathname === '/login' ? "default" : "ghost"} className="font-medium" aria-current={location.pathname === '/login' ? "page" : undefined}>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
