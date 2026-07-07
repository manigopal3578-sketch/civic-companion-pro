import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/smart-bharat/Navbar";
import { Hero } from "@/components/smart-bharat/Hero";
import { Problem } from "@/components/smart-bharat/Problem";
import { Demo } from "@/components/smart-bharat/Demo";
import { Features } from "@/components/smart-bharat/Features";
import { HowItWorks } from "@/components/smart-bharat/HowItWorks";
import { Impact } from "@/components/smart-bharat/Impact";
import { Testimonials } from "@/components/smart-bharat/Testimonials";
import { Report } from "@/components/smart-bharat/Report";
import { FinalCTA } from "@/components/smart-bharat/FinalCTA";
import { Footer } from "@/components/smart-bharat/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Problem />
      <Demo />
      <Features />
      <HowItWorks />
      <Impact />
      <Testimonials />
      <Report />
      <FinalCTA />
      <Footer />
    </main>
  );
}
