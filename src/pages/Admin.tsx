import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Car, TrendingUp, Users, Phone } from "lucide-react";
import { toast } from "sonner";

interface Driver {
  id: string;
  name: string;
  vehicle_number: string;
  ride_type: string;
  current_location: string;
  phone: string;
  rating: number;
  status: string;
}

interface Booking {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  ride_type: string;
  estimated_fare: string;
  status: string;
  created_at: string;
  driver_id: string;
  user_phone: string;
}

export default function Admin() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ totalRides: 0, activeRides: 0, revenue: 0 });

  useEffect(() => {
    fetchData();
    
    // Real-time subscriptions
    const bookingsChannel = supabase
      .channel('bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ride_bookings' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsChannel);
    };
  }, []);

  const fetchData = async () => {
    const [driversRes, bookingsRes] = await Promise.all([
      supabase.from('drivers').select('*').order('created_at', { ascending: false }),
      supabase.from('ride_bookings').select('*').order('created_at', { ascending: false }),
    ]);

    if (driversRes.data) setDrivers(driversRes.data);
    if (bookingsRes.data) {
      setBookings(bookingsRes.data);
      const totalRides = bookingsRes.data.length;
      const activeRides = bookingsRes.data.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
      const revenue = bookingsRes.data.reduce((sum, b) => {
        const fare = parseInt(b.estimated_fare?.replace('₹', '') || '0');
        return sum + fare;
      }, 0);
      setStats({ totalRides, activeRides, revenue });
    }
  };

  const updateDriverStatus = async (driverId: string, newStatus: string) => {
    const { error } = await supabase
      .from('drivers')
      .update({ status: newStatus })
      .eq('id', driverId);

    if (error) {
      toast.error('Failed to update driver status');
    } else {
      toast.success('Driver status updated');
      fetchData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'on_trip':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'offline':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage rides, drivers, and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rides</p>
                <p className="text-3xl font-bold text-primary">{stats.totalRides}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-xl">
                <Car className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Rides</p>
                <p className="text-3xl font-bold text-accent">{stats.activeRides}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{stats.revenue}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4 mt-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize">{booking.ride_type}</Badge>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-1" />
                        <span className="text-sm font-medium">{booking.pickup_location}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-accent mt-1" />
                        <span className="text-sm font-medium">{booking.dropoff_location}</span>
                      </div>
                      {booking.user_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{booking.user_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{booking.estimated_fare}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(booking.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="drivers" className="space-y-4 mt-6">
            {drivers.map((driver) => (
              <Card key={driver.id} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{driver.name}</h3>
                      <Badge className={getStatusColor(driver.status)}>{driver.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{driver.vehicle_number}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">{driver.ride_type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{driver.current_location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <p className="font-medium">⭐ {driver.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {driver.status !== 'available' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateDriverStatus(driver.id, 'available')}
                      >
                        Set Available
                      </Button>
                    )}
                    {driver.status !== 'offline' && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => updateDriverStatus(driver.id, 'offline')}
                      >
                        Set Offline
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}