"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTryDemo = async () => {
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email: "demo@workermill.com",
        password: "demo1234",
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Demo sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">CalMill</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
              <a href="https://github.com/workermill-examples/calmill" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Source
              </a>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Sign In</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.06),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                <span className="block">Open Scheduling</span>
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">for Everyone</span>
              </h1>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                The open-source scheduling platform with Google Calendar sync, team scheduling, embeddable widgets, and webhooks. Built to showcase what AI can create.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-base px-8 py-3 bg-blue-600 hover:bg-blue-700" onClick={handleTryDemo} loading={isLoading}>
                  Try the Demo
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Button>
                <Link href="https://github.com/workermill-examples/calmill" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg font-medium border border-gray-300 bg-white hover:bg-gray-50 h-12 px-8 text-base text-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  View on GitHub
                </Link>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">demo@workermill.com</code>
                <span>·</span>
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">demo1234</code>
              </div>
            </div>

            {/* Hero Mockup */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-500">calmill.workermill.com</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">My Event Types</div>
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">6 active</div>
                  </div>
                  {[
                    { name: "Quick Chat", duration: "15 min", color: "bg-green-500" },
                    { name: "30 Minute Meeting", duration: "30 min", color: "bg-blue-500" },
                    { name: "Technical Interview", duration: "45 min", color: "bg-purple-500" },
                    { name: "Pair Programming", duration: "90 min", color: "bg-orange-500" },
                  ].map((event) => (
                    <div key={event.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className={`w-2 h-8 rounded-full ${event.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{event.name}</div>
                        <div className="text-xs text-gray-500">{event.duration}</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Features</p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything you need for scheduling</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From simple appointments to complex team coordination, CalMill handles it all with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "bg-blue-100 text-blue-600", title: "Smart Scheduling", desc: "Timezone-aware availability with Google Calendar sync. Automatically detect conflicts and find the perfect time." },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: "bg-green-100 text-green-600", title: "Team Scheduling", desc: "Round-robin and collective scheduling algorithms. Automatically balance workload across team members." },
              { icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", color: "bg-purple-100 text-purple-600", title: "Embed Anywhere", desc: "Drop-in booking widgets for any website. Inline or popup — one line of code, fully customizable." },
              { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", color: "bg-orange-100 text-orange-600", title: "Webhook Notifications", desc: "HMAC-signed webhook delivery for booking events. Integrate with any system via real-time callbacks." },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", color: "bg-pink-100 text-pink-600", title: "Recurring Bookings", desc: "Weekly, biweekly, and monthly recurring series. Bulk management with cancel-future support." },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", color: "bg-red-100 text-red-600", title: "Secure & Reliable", desc: "NextAuth v5 authentication, HMAC-signed webhooks, and production-grade infrastructure on Vercel + Neon." },
            ].map((feature) => (
              <div key={feature.title} className="group p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">How it works</p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Get started in minutes</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From setup to your first booking, CalMill makes scheduling effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create Event Types", desc: "Define your meeting types with custom durations, locations, and booking questions." },
              { step: "02", title: "Set Your Availability", desc: "Configure your weekly schedule with timezone support and date overrides." },
              { step: "03", title: "Share Your Link", desc: "Send your booking page or embed a widget directly on your website." },
              { step: "04", title: "Get Booked", desc: "Attendees pick a time, you get notified, and it syncs to Google Calendar." },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built by WorkerMill Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="text-blue-300">Built by</span>
                <a href="https://workermill.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-blue-300 transition-colors flex items-center gap-1">
                  WorkerMill
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>

              <h2 className="text-3xl font-bold mb-4">This entire app was built by AI</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                WorkerMill is an autonomous AI coding platform. Give it a ticket, and it plans, codes, tests, reviews, and deploys — end to end. CalMill is a showcase of what&apos;s possible.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">14</div>
                  <div className="text-sm text-gray-400">Database Models</div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">35+</div>
                  <div className="text-sm text-gray-400">API Endpoints</div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">420</div>
                  <div className="text-sm text-gray-400">Automated Tests</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://workermill.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 transition-colors">
                  Learn About WorkerMill
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
                <a href="https://github.com/workermill-examples/calmill" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/10 h-12 px-8 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to see it in action?</h2>
          <p className="mt-3 text-blue-100">Explore the full app with pre-loaded demo data. No signup required.</p>
          <div className="mt-6">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-0 text-base px-8" onClick={handleTryDemo} loading={isLoading}>
              Try the Demo Now
            </Button>
          </div>
          <p className="mt-3 text-sm text-blue-200">
            Demo login: <code className="bg-white/20 px-1.5 py-0.5 rounded">demo@workermill.com</code> / <code className="bg-white/20 px-1.5 py-0.5 rounded">demo1234</code>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-400">Built by</span>
                <a href="https://workermill.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-blue-400 transition-colors flex items-center gap-1">
                  WorkerMill
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
              <p className="text-sm text-gray-400">CalMill is a showcase project demonstrating AI-powered full-stack development with Next.js, TypeScript, and production-grade architecture.</p>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://workermill.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">About WorkerMill</a></li>
                <li><a href="https://github.com/workermill-examples/calmill" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Source Code</a></li>
                <li><a href="https://workermill.com/#showcase" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">More Examples</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4">Tech Stack</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Next.js 16</li>
                <li>TypeScript</li>
                <li>Prisma 7 + PostgreSQL</li>
                <li>NextAuth v5</li>
                <li>TailwindCSS 4</li>
                <li>Vercel + Neon</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <span className="font-semibold text-sm">CalMill</span>
              <span className="text-gray-500 text-sm">· &copy; 2026 WorkerMill. Demo project.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com/workermill-examples/calmill" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
