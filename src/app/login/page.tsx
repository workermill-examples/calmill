'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { loginSchema, type LoginInput } from '@/lib/validations';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginInput>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const callbackUrl = searchParams.get('callbackUrl') || '/event-types';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Validate with Zod
    const validatedFields = loginSchema.safeParse(credentials);

    if (!validatedFields.success) {
      const fieldErrors: Partial<LoginInput> = {};
      validatedFields.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof LoginInput] = error.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setGeneralError('Invalid email or password. Please try again.');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryDemo = async () => {
    setIsDemoLoading(true);
    setGeneralError('');

    try {
      const result = await signIn('credentials', {
        email: 'demo@workermill.com',
        password: 'demo1234',
        redirect: false,
      });

      if (result?.error) {
        setGeneralError('Demo account not available. Please try creating an account.');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setGeneralError('Demo account not available. Please try creating an account.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-600">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">CalMill</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {generalError && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{generalError}</div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading || isDemoLoading}
              >
                Sign in
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleTryDemo}
                loading={isDemoLoading}
                disabled={isLoading || isDemoLoading}
              >
                Try the Demo
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}