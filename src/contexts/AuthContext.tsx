
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  reloadProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch profile from Supabase
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        location: data.location || "",
      });
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
    if (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  // On mount, restore user session and profile from Supabase auth
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // For use in Profile page to reload up-to-date info
  const reloadProfile = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchProfile(session.user.id);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.session?.user) {
      setIsLoading(false);
      throw new Error(error?.message || "Login failed. Please try again.");
    }
    await fetchProfile(data.session.user.id);
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Sign up via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      setIsLoading(false);
      throw new Error(error.message || "Signup failed. Please try again.");
    }
    // Profile will be auto-created by the trigger, so fetch it
    if (data.user) {
      await fetchProfile(data.user.id);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoading(false);
    toast({
      title: "Logged out successfully",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    setIsLoading(true);
    const updates = { ...data, updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    await reloadProfile();
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      signup,
      logout,
      updateProfile,
      isLoading,
      reloadProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
