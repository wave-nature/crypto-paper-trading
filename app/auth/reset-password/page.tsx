import { ResetPasswordForm } from "@/app/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-white to-violet-100 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/20">
      <ResetPasswordForm />
    </div>
  )
}
