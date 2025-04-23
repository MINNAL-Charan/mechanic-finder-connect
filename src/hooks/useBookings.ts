
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

// Define booking type based on Supabase database types
type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

// Fetch user bookings
export function useBookings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });
      
      if (error) {
        console.error("Error fetching bookings:", error);
        throw error;
      }
      console.log("Fetched bookings:", data);
      return data || [];
    },
    enabled: !!user,
  });

  // Create a new booking
  const createBooking = useMutation({
    mutationFn: async (booking: Omit<BookingInsert, 'user_id' | 'status'>) => {
      const newBooking: BookingInsert = {
        ...booking,
        user_id: user?.id || '',
        status: "Confirmed"
      };
      console.log("Creating booking:", newBooking);
      const { data, error } = await supabase
        .from("bookings")
        .insert(newBooking)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating booking:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", user?.id] });
    },
  });

  // Cancel booking
  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      console.log("Cancelling booking:", bookingId);
      const { error } = await supabase
        .from("bookings")
        .update({ status: "Cancelled" })
        .eq("id", bookingId);
      
      if (error) {
        console.error("Error cancelling booking:", error);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings", user?.id] }),
  });

  return {
    bookings: data as Booking[],
    isLoading,
    error,
    createBooking,
    cancelBooking,
  };
}
