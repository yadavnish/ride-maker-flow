import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { pickupLocation, dropoffLocation, rideType, userPhone } = await req.json();

    // Find available driver for the ride type
    const { data: drivers, error: driverError } = await supabaseClient
      .from('drivers')
      .select('*')
      .eq('ride_type', rideType)
      .eq('status', 'available')
      .limit(1);

    if (driverError) throw driverError;

    if (!drivers || drivers.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No available drivers for this ride type' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const driver = drivers[0];

    // Calculate estimated fare (mock calculation)
    const distance = Math.random() * 15 + 2; // 2-17 km
    const baseFares: { [key: string]: number } = {
      'economy': 5,
      'comfort': 8,
      'premium': 15,
    };
    const estimatedFare = `₹${(baseFares[rideType] + distance * 12).toFixed(0)}`;

    // Create ride booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('ride_bookings')
      .insert({
        pickup_location: pickupLocation,
        dropoff_location: dropoffLocation,
        ride_type: rideType,
        estimated_fare: estimatedFare,
        status: 'confirmed',
        driver_id: driver.id,
        user_phone: userPhone,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Update driver status
    await supabaseClient
      .from('drivers')
      .update({ status: 'on_trip' })
      .eq('id', driver.id);

    // Create initial tracking entry
    await supabaseClient
      .from('live_tracking')
      .insert({
        ride_id: booking.id,
        driver_id: driver.id,
        current_lat: 12.9716 + (Math.random() - 0.5) * 0.1,
        current_lng: 77.5946 + (Math.random() - 0.5) * 0.1,
        status: 'driver_assigned',
      });

    return new Response(JSON.stringify({
      success: true,
      booking,
      driver: {
        name: driver.name,
        vehicle: driver.vehicle_number,
        phone: driver.phone,
        rating: driver.rating,
      },
      message: `✅ Ride booked! ${driver.name} will arrive in 3-5 minutes.`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in book-ride:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});