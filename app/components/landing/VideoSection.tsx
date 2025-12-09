export default function VideoSection() {
  return (
    <section id="video-demo" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                    See Paprweight in Action
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Watch how easy it is to execute trades, analyze charts, and track your portfolio performance in real-time.
                </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card aspect-video max-w-5xl mx-auto group">
                <video 
                    className="w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    src="/demo.mp4"
                >
                    Your browser does not support the video tag.
                </video>
                
                {/* Optional overlay (hidden when playing usually, but here we just let the video play) */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>
        </div>
    </section>
  )
}
