-- Create drivers table
CREATE TABLE public.drivers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  ride_type TEXT NOT NULL,
  current_location TEXT,
  phone TEXT,
  rating DECIMAL(3,2) DEFAULT 4.5,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create live tracking table
CREATE TABLE public.live_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES public.ride_bookings(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  status TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add driver_id to ride_bookings
ALTER TABLE public.ride_bookings ADD COLUMN driver_id UUID REFERENCES public.drivers(id);
ALTER TABLE public.ride_bookings ADD COLUMN user_phone TEXT;
ALTER TABLE public.ride_bookings ADD COLUMN pickup_lat DOUBLE PRECISION;
ALTER TABLE public.ride_bookings ADD COLUMN pickup_lng DOUBLE PRECISION;
ALTER TABLE public.ride_bookings ADD COLUMN dropoff_lat DOUBLE PRECISION;
ALTER TABLE public.ride_bookings ADD COLUMN dropoff_lng DOUBLE PRECISION;

-- Enable RLS on new tables
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_tracking ENABLE ROW LEVEL SECURITY;

-- Policies for drivers
CREATE POLICY "Anyone can view drivers"
  ON public.drivers
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update drivers"
  ON public.drivers
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can insert drivers"
  ON public.drivers
  FOR INSERT
  WITH CHECK (true);

-- Policies for live_tracking
CREATE POLICY "Anyone can view live tracking"
  ON public.live_tracking
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert live tracking"
  ON public.live_tracking
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update live tracking"
  ON public.live_tracking
  FOR UPDATE
  USING (true);

-- Insert sample drivers
INSERT INTO public.drivers (name, vehicle_number, ride_type, current_location, phone, rating, status) VALUES
  ('Rajesh Kumar', 'KA01AB1234', 'economy', 'Indiranagar, Bangalore', '+919876543210', 4.8, 'available'),
  ('Amit Sharma', 'KA02CD5678', 'comfort', 'Koramangala, Bangalore', '+919876543211', 4.6, 'available'),
  ('Vijay Patel', 'KA03EF9012', 'premium', 'MG Road, Bangalore', '+919876543212', 4.9, 'available'),
  ('Suresh Reddy', 'KA04GH3456', 'economy', 'Whitefield, Bangalore', '+919876543213', 4.5, 'available'),
  ('Prakash Singh', 'KA05IJ7890', 'comfort', 'Electronic City, Bangalore', '+919876543214', 4.7, 'available');