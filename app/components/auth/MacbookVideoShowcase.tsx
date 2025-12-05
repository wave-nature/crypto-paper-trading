"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

export function MacbookVideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error)
      })
    }
  }, [])

  return (
    <div className="relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Heading with modern typography */}
        <div className="flex flex-col items-center justify-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Live Demo</span>
          </div>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent text-balance max-w-4xl pb-3">
            Let's explore the amazing world of trading
          </h2>
          <p className="text-slate-600 text-lg md:text-xl text-center max-w-2xl text-pretty">
            Experience seamless trading with our cutting-edge platform
          </p>
        </div>

        {/* MacBook showcase with enhanced styling */}
        <div className="relative w-full perspective-1000 animate-slide-up">
          {/* Glow effect behind MacBook */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 via-blue-500/10 to-transparent blur-3xl -z-10 scale-95" />

          {/* MacBook image with mix-blend for background removal effect */}
          <div className="relative drop-shadow-2xl">
            <Image
              src="/macbook.png"
              alt="MacBook Pro"
              width={1400}
              height={1000}
              priority
              className="relative z-10 w-full h-full mix-blend-multiply rounded-2xl"
              style={{ filter: "contrast(1.05) brightness(1.02)" }}
            />

            {/* Video overlay - positioned to match MacBook screen with enhanced shadow */}
            <div
              className="absolute top-[8.5%] left-[25%] w-[50%] h-[60%] overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10"
              style={{ zIndex: 100 }}
            >
              <video ref={videoRef} className="w-full h-full object-cover" loop muted playsInline autoPlay>
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Subtle screen reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Floating feature cards */}
          <div className="absolute -left-4 top-1/4 md:left-8 animate-float">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/50 max-w-[200px] hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                  ↑
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">24h Change</p>
                  <p className="text-lg font-bold text-green-600">+12.5%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/3 md:right-8 animate-float-delayed">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200/50 max-w-[200px] hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
                  ⚡
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fast Trading</p>
                  <p className="text-lg font-bold text-slate-900">&lt;50ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s both;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 1s;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .bg-grid-slate-200\/50 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23cbd5e1' fillOpacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}
