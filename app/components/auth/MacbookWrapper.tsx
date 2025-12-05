import { MacbookVideoShowcase } from "@/app/components/auth/MacbookVideoShowcase";

export default function MacbookWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-background to-violet-100 dark:from-violet-950/20 dark:via-background dark:to-violet-900/20">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Signup Form */}
          <div className="flex justify-center lg:justify-end">{children}</div>

          {/* Right Side - MacBook Video Showcase */}
          <div className="hidden lg:flex justify-center lg:justify-start">
            <MacbookVideoShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}
