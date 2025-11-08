import { BookingForm } from "@/components/BookingForm";
import { RecentBookings } from "@/components/RecentBookings";
import { Button } from "@/components/ui/button";
import { Car, MessageCircle, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
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
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Book via WhatsApp • AI-Powered</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Uber on WhatsApp
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Book rides instantly through WhatsApp chat or voice — powered by AI
            </p>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <Link to="/chat">
                <MessageCircle className="w-5 h-5" />
                Try WhatsApp Chat Now
              </Link>
            </Button>
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Uber on WhatsApp?</h2>
            <p className="text-muted-foreground">Revolutionizing ride booking with AI and accessibility</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-card rounded-2xl border">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Chat to Book</h3>
              <p className="text-sm text-muted-foreground">
                Just message on WhatsApp — no app needed
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl border">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Smart AI understands voice and text in any language
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl border">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-Time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Live updates and driver tracking via chat
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-2xl border">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe & Secure</h3>
              <p className="text-sm text-muted-foreground">
                AI emotion detection and safety alerts
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
