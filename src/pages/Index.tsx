import { BookingForm } from "@/components/BookingForm";
import { RecentBookings } from "@/components/RecentBookings";
import { Car } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Car className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Your Ride, Your Way</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Book Your Ride
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Fast, reliable, and affordable rides at your fingertips
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Booking Form */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Book a Ride</h2>
              <BookingForm />
            </div>

            {/* Recent Bookings */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>
              <RecentBookings />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Booking</h3>
              <p className="text-sm text-muted-foreground">
                Book your ride in seconds with our streamlined process
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multiple Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose from economy, comfort, or premium rides
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Transparent Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Know your fare before you book with upfront pricing
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
