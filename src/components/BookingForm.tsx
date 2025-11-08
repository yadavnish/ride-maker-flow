import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RideTypeCard } from "./RideTypeCard";
import { Car, Sparkles, Crown, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const rideTypes = [
  {
    id: "economy",
    icon: Car,
    title: "Economy",
    description: "Affordable rides for everyday travel",
    estimatedTime: "2-5 min away",
    baseFare: 5,
  },
  {
    id: "comfort",
    icon: Sparkles,
    title: "Comfort",
    description: "Extra space and newer vehicles",
    estimatedTime: "3-7 min away",
    baseFare: 8,
  },
  {
    id: "premium",
    icon: Crown,
    title: "Premium",
    description: "Luxury rides with top-rated drivers",
    estimatedTime: "5-10 min away",
    baseFare: 15,
  },
];

export const BookingForm = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [selectedRideType, setSelectedRideType] = useState("economy");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateFare = () => {
    const selectedRide = rideTypes.find((ride) => ride.id === selectedRideType);
    if (!selectedRide || !pickupLocation || !dropoffLocation) return null;
    
    const distance = Math.random() * 10 + 2; // Mock distance calculation
    const fare = (selectedRide.baseFare + distance * 1.5).toFixed(2);
    return `$${fare}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocation || !dropoffLocation) {
      toast.error("Please enter both pickup and dropoff locations");
      return;
    }

    setIsSubmitting(true);

    try {
      const estimatedFare = calculateFare();
      
      const { error } = await supabase.from("ride_bookings").insert({
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        ride_type: selectedRideType,
        estimated_fare: estimatedFare,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Ride booked successfully!", {
        description: `Your ${selectedRideType} ride is on the way. Estimated fare: ${estimatedFare}`,
      });

      // Reset form
      setPickupLocation("");
      setDropoffLocation("");
      setSelectedRideType("economy");
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error("Failed to book ride. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedFare = calculateFare();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pickup" className="text-sm font-medium">
            Pickup Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="pickup"
              placeholder="Enter pickup address"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="pl-11"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dropoff" className="text-sm font-medium">
            Dropoff Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="dropoff"
              placeholder="Enter dropoff address"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="pl-11"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Choose Your Ride</Label>
        <div className="grid gap-3">
          {rideTypes.map((ride) => (
            <RideTypeCard
              key={ride.id}
              icon={ride.icon}
              title={ride.title}
              description={ride.description}
              estimatedTime={ride.estimatedTime}
              selected={selectedRideType === ride.id}
              onClick={() => setSelectedRideType(ride.id)}
            />
          ))}
        </div>
      </div>

      {estimatedFare && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estimated Fare</span>
            <span className="text-2xl font-bold text-primary">{estimatedFare}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold shadow-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Booking..." : "Confirm Booking"}
      </Button>
    </form>
  );
};
