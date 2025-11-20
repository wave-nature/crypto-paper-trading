import { SignupForm } from "@/app/components/auth/SingupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-background to-violet-100 dark:from-violet-950/20 dark:via-background dark:to-violet-900/20 p-4">
      <SignupForm />
    </div>
  );
}
