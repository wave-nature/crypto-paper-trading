
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/app/constants/blogs";

export default function BlogSection() {
  const posts = BLOG_POSTS;

  return (
    <section id="blogs" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
             <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Latest Insights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Tips, strategies, and market analysis to help you become a better trader.
            </p>
          </div>
          <Link 
            href="/blogs" 
            className="group flex items-center font-medium text-violet-600 hover:text-violet-700 transition-colors"
          >
            View all articles
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Link 
                href={`/blogs/${index}`} // Placeholder link
                key={index} 
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-48 w-full ${post.image} relative overflow-hidden`}>
                 <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" /> {/* Placeholder image simulation */}
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
                <div className="text-sm font-medium text-muted-foreground mt-auto">
                    {post.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
