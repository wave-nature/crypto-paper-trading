import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import VideoSection from "./components/landing/VideoSection";
import Pricing from "./components/landing/Pricing";
import BlogSection from "./components/landing/BlogSection";
import Footer from "./components/landing/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-violet-500/30">
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <Pricing />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
