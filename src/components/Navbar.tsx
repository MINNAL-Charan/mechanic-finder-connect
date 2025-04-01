
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MapPin, User, LogIn } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-6 md:top-0 md:bottom-auto z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="md:flex items-center hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">MechanicFinder</span>
          </Link>
        </div>
        
        <div className="flex justify-between w-full md:w-auto md:gap-2">
          <Link to="/" className="flex flex-col items-center text-xs md:hidden">
            <Home className={`h-6 w-6 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span>Home</span>
          </Link>
          
          <Link to="/location" className="flex flex-col items-center text-xs md:hidden">
            <MapPin className={`h-6 w-6 ${location.pathname === '/location' ? 'text-primary' : 'text-muted-foreground'}`} />
            <span>Map</span>
          </Link>
          
          {isLoggedIn ? (
            <Link to="/profile" className="flex flex-col items-center text-xs md:hidden">
              <User className={`h-6 w-6 ${location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span>Profile</span>
            </Link>
          ) : (
            <Link to="/login" className="flex flex-col items-center text-xs md:hidden">
              <LogIn className={`h-6 w-6 ${location.pathname === '/login' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span>Login</span>
            </Link>
          )}
          
          <div className="hidden md:flex gap-4">
            <Link to="/">
              <Button variant={location.pathname === '/' ? "default" : "ghost"}>Home</Button>
            </Link>
            <Link to="/location">
              <Button variant={location.pathname === '/location' ? "default" : "ghost"}>Find Mechanics</Button>
            </Link>
            {isLoggedIn ? (
              <Link to="/profile">
                <Button variant={location.pathname === '/profile' ? "default" : "ghost"}>Profile</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant={location.pathname === '/login' ? "default" : "ghost"}>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
