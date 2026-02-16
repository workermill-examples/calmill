'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signupSchema, type SignupInput } from '@/lib/validations';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupInput>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    const formData = new FormData(e.currentTarget);
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    // Validate with Zod
    const validatedFields = signupSchema.safeParse(userData);

    if (!validatedFields.success) {
      const fieldErrors: Partial<SignupInput> = {};
      validatedFields.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as keyof SignupInput] = error.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Call signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedFields.data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          // Handle duplicate email/username
          if (result.field === 'email') {
            setErrors({ email: 'This email address is already registered.' });
          } else if (result.field === 'username') {
            setErrors({ username: 'This username is already taken.' });
          } else {
            setGeneralError(result.message || 'Email or username already exists.');
          }
        } else {
          setGeneralError(result.message || 'Something went wrong. Please try again.');
        }
        return;
      }

      // Auto-login after successful signup
      const signInResult = await signIn('credentials', {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // If auto-login fails, redirect to login page with success message
        router.push('/login?message=Account created successfully. Please sign in.');
      } else {
        // Redirect to getting started page
        router.push('/getting-started');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setGeneralError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
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
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started with CalMill in just a few minutes
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Enter your full name"
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>

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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Choose a username"
                error={!!errors.username}
                helperText={errors.username || 'This will be part of your booking URL: calmill.com/your-username'}
                className="font-mono"
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
                autoComplete="new-password"
                required
                placeholder="Create a secure password"
                error={!!errors.password}
                helperText={errors.password}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in
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