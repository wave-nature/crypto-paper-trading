'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Mail, ArrowLeft } from 'lucide-react'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate password reset email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-violet-200 dark:border-violet-800/50 flex flex-col justify-center">
      <CardHeader className="space-y-3 text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-violet-500 rounded-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-balance">
          {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
        </CardTitle>
        <CardDescription className="text-base">
          {isSubmitted 
            ? 'We have sent a password reset link to your email address.' 
            : 'Enter your email and we will send you a link to reset your password.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                If an account exists for <span className="font-medium text-foreground">{email}</span>, you will receive a password reset link shortly.
              </p>
            </div>
            
            <Button 
              type="button"
              className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium"
              onClick={() => window.location.href = '/'}
            >
              Return to Login
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <a 
          href="/auth/login" 
          className="flex items-center gap-2 text-sm text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </a>
      </CardFooter>
    </Card>
  )
}
