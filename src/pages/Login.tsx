
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Wrench, Mail, AlertCircle } from "lucide-react";

const ForgotPasswordModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  // Use direct Supabase client since not every context can reach AuthContext implementation
  const sendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      if (!email) {
        toast({ title: "Please enter your email", variant: "destructive" });
        setSending(false);
        return;
      }
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        toast({ title: "Failed to send reset email", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Password reset email sent", description: "Check your inbox (and spam folder)!" });
        onClose();
      }
    } catch (err: any) {
      toast({ title: "Failed to send reset email", description: err.message, variant: "destructive" });
    }
    setSending(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
        <button className="absolute right-3 top-3 text-xl" onClick={onClose}>&times;</button>
        <div className="flex flex-col items-center gap-2">
          <Mail className="h-7 w-7 text-primary" />
          <div className="font-bold">Forgot Password?</div>
          <p className="text-sm text-muted-foreground mb-2 text-center">Enter your email and we'll send a reset link.</p>
          <form className="w-full space-y-3" onSubmit={sendResetLink}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={sending}
              autoFocus
            />
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const resendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification email sent",
          description: "Please check your inbox (and spam folder)",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have successfully logged in",
      });
      navigate("/");
    } catch (error: any) {
      // Check for email not confirmed error
      if (error.message?.includes("email_not_confirmed") || error.message?.includes("Email not confirmed")) {
        setVerificationNeeded(true);
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <ForgotPasswordModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-primary">ChennaiMechanics</span>
              </div>
              <LogIn className="h-8 w-8 text-primary mt-2" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Login to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access ChennaiMechanics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationNeeded && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Email verification required</p>
                <p className="text-amber-700 mt-1">Please check your inbox and verify your email before logging in.</p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-amber-800 mt-1" 
                  onClick={resendVerificationEmail}
                  disabled={isLoading}
                >
                  Resend verification email
                </Button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="rounded-md"
              />
            </div>
            <Button className="w-full gradient-bg" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-primary underline text-xs mt-2 hover:text-primary/80"
                onClick={() => setModalOpen(true)}
                tabIndex={-1}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
