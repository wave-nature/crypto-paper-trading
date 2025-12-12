import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ParticlesBackground from "./ParticlesBackground";
import { AUTH_SIGNUP } from "@/constants/navigation";

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <ParticlesBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent h-[500px] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-8">
          What if you took this trade <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 animate-gradient">
             in realtime?
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 leading-relaxed">
         Don't worry, one day you will, because you are on the way to wipe out the line between beginner and pro trader with sheer practice, dedication, and discipline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={AUTH_SIGNUP}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 bg-violet-600 rounded-full hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
          >
            Start Trading Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute -inset-3 rounded-full bg-violet-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>
          <Link
            href="#video-demo"
            className="px-8 py-3 text-lg font-medium text-foreground transition-all duration-200 bg-background border border-input rounded-full hover:bg-accent hover:text-accent-foreground"
          >
            Watch Demo
          </Link>
        </div>
        
        {/* Stats or Trust Indicators (Optional enhancement) */}
        <div className="mt-16 pt-8 border-t border-border/40 grid grid-cols-2 gap-8 md:grid-cols-4 opacity-70">
          <div>
            <div className="text-3xl font-bold">10k+</div>
            <div className="text-sm text-muted-foreground">Active Traders</div>
          </div>
          <div>
            <div className="text-3xl font-bold">$1B+</div>
            <div className="text-sm text-muted-foreground">Volume Traded</div>
          </div>
           <div>
            <div className="text-3xl font-bold">50+</div>
            <div className="text-sm text-muted-foreground">Indicators</div>
          </div>
           <div>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
