'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signupSchema } from '@/lib/validations';
import { z } from 'zod';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    general?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      // Validate with Zod
      const validated = signupSchema.parse({ name, email, username, password });

      // Create account via API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validated),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Duplicate email or username
          setErrors({ general: data.error });
        } else if (response.status === 400 && data.details) {
          // Validation errors from server
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail: { field: string; message: string }) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors as any);
        } else {
          setErrors({ general: data.error || 'Failed to create account' });
        }
        return;
      }

      // Account created successfully - auto-login
      const signInResult = await signIn('credentials', {
        email: validated.email,
        password: validated.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Login failed after signup - redirect to login page
        router.push('/login?message=Account created. Please sign in.');
      } else {
        // Success - redirect to onboarding
        router.push('/getting-started');
        router.refresh();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors as any);
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-2xl font-semibold text-gray-900">CalMill</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Get started with your free CalMill account</p>
        </div>

        {/* Signup Form */}
        <div className="mt-8">
          <div className="rounded-lg bg-white px-8 py-10 shadow-sm border border-gray-200">
            {errors.general && (
              <div className="mb-4 rounded-md bg-danger/10 border border-danger/20 px-4 py-3">
                <p className="text-sm text-danger">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                required
                autoComplete="name"
                error={errors.name}
                placeholder="Alex Smith"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                required
                autoComplete="email"
                error={errors.email}
                placeholder="you@example.com"
              />

              <Input
                label="Username"
                type="text"
                name="username"
                required
                autoComplete="username"
                error={errors.username}
                placeholder="alexsmith"
                helperText="Lowercase letters, numbers, hyphens, and underscores only"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                required
                autoComplete="new-password"
                error={errors.password}
                placeholder="••••••••"
                helperText="At least 8 characters"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
