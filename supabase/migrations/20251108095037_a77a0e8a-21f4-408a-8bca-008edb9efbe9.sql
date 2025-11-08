-- Create ride bookings table
CREATE TABLE public.ride_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  ride_type TEXT NOT NULL,
  estimated_fare TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ride_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing all bookings (public access for demo)
CREATE POLICY "Anyone can view ride bookings"
  ON public.ride_bookings
  FOR SELECT
  USING (true);

-- Create policy for creating bookings
CREATE POLICY "Anyone can create ride bookings"
  ON public.ride_bookings
  FOR INSERT
  WITH CHECK (true);