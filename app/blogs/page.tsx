import { BLOG_POSTS } from "@/app/constants/blogs";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
                    Paprweight Blog
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    News, strategies, and insights for the modern crypto trader.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
                <Link 
                    href={`/blogs/${post.id}`} 
                    key={post.id}
                    className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                <div className={`h-56 w-full ${post.image} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-3">
                    <span className="text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-2 py-1 rounded-full">{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-violet-600 transition-colors">
                    {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                    </p>
                    <div className="text-sm font-medium text-muted-foreground mt-auto flex items-center justify-between">
                        <span>{post.date}</span>
                        <span className="flex items-center text-violet-600 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                            Read more <ArrowRight className="ml-1 w-4 h-4" />
                        </span>
                    </div>
                </div>
                </Link>
            ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
