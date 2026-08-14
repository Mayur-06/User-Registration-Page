import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
//import TrustedBy from "@/components/landing/TrustedBy";
import Features from "@/components/landing/Features";
//import CoreFeatures from "@/components/landing/CoreFeatures";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-bg-page font-body">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}