import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DemoReal } from "@/components/DemoReal";
import { Architecture } from "@/components/Architecture";
import { Results } from "@/components/Results";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <DemoReal />
      <Architecture />
      <Results />
      <Footer />
    </div>
  );
};

export default Index;
