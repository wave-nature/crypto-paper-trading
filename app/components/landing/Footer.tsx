import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Big Bold Brand Name */}
        <div className="mb-20 text-center flex justify-center">
             <h2 className="text-[15vw] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground/80 to-foreground/20 select-none">
                PAPRWEIGHT
            </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 place-items-center">
            <div className="col-span-2 md:col-span-1">
                <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
                    Paprweight
                </Link>
                <p className="text-muted-foreground text-sm mb-6">
                    The safest way to master crypto trading. Practice with real market data, zero risk.
                </p>
                <div className="flex space-x-4">
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-5 w-5" />
                         <span className="sr-only">GitHub</span>
                    </Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Linkedin className="h-5 w-5" />
                         <span className="sr-only">LinkedIn</span>
                    </Link>
                </div>
            </div>
            
            <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                    <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
                </ul>
            </div>

             <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="#blogs" className="hover:text-foreground transition-colors">Blog</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
                </ul>
            </div>

             <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                    <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                </ul>
            </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Paprweight Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
