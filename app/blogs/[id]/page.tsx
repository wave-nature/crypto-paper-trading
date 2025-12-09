import { BLOG_POSTS } from "@/app/constants/blogs";
import Navbar from "@/app/components/landing/Navbar";
import Footer from "@/app/components/landing/Footer";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

export default function BlogDetailsPage({ params }: { params: { id: string } }) {
  const post = BLOG_POSTS.find((p) => p.id === params.id) || BLOG_POSTS[parseInt(params.id)];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
                href="/blogs" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-violet-600 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
            </Link>

            <header className="mb-10">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="inline-flex items-center text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-2.5 py-0.5 rounded-full font-medium">
                        <Tag className="w-3 h-3 mr-1" />
                        {post.category}
                    </span>
                    <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                    </span>
                    <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                    </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-6">
                    {post.title}
                </h1>
                
                {/* Simulated Image */}
                 <div className={`w-full h-64 sm:h-80 rounded-2xl ${post.image} mb-8 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-800/50 mix-blend-overlay" />
                 </div>
            </header>

            <div 
                className="prose prose-lg dark:prose-invert prose-violet max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
        </article>
      </main>
      <Footer />
    </div>
  );
}
