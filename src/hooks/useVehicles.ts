
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Fetch user vehicles
export function useVehicles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Add vehicle
  const addVehicle = useMutation({
    mutationFn: async (vehicle: { model: string; year: string; license_plate: string }) => {
      if (!user) throw new Error("Not logged in");
      const { error } = await supabase.from("vehicles").insert([
        { ...vehicle, user_id: user.id },
      ]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles", user?.id] }),
  });

  // Delete vehicle
  const removeVehicle = useMutation({
    mutationFn: async (vehicleId: string) => {
      const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vehicles", user?.id] }),
  });

  return {
    vehicles: data || [],
    isLoading,
    error,
    addVehicle,
    removeVehicle,
  };
}
