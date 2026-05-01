"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronDown,
  ArrowUpRight,
  Code,
  HelpCircle,
  Lock,
  UsersRound,
  Zap,
  Linkedin,
  Instagram,
  Mail,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const BRAND = "#1B6FA8"


export default function OdysseyFundLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  const tabs = [
    { id: "dashboard", label: "Product dashboard", src: "/dashboard.png" },
    { id: "activity", label: "Product activity", src: "/activity.png" },
    { id: "contributors", label: "Product contributors", src: "/contributors.png" },
    { id: "funds", label: "Product funds", src: "/funds.png" },
  ]

  const activeTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Odyssey Fund" className="h-7" />
              </Link>
              <nav className="hidden items-center gap-6 lg:flex">
                <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                  Product <ChevronDown className="h-4 w-4" />
                </button>
                <Link href="#" className="text-gray-700 hover:text-gray-900">
                  Download
                </Link>
                <Link
                  href="https://www.cornellh4i.org/"
                  className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                >
                  About <span className="text-[#1B5E20]">Cornell Hack4Impact</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>
            <div className="hidden items-center gap-3 lg:flex">
              <Button variant="ghost" className="text-gray-700" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: BRAND }}
                asChild
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="mt-4 space-y-4 pb-4 lg:hidden">
              <button className="flex w-full items-center gap-1 text-gray-700 hover:text-gray-900">
                Product <ChevronDown className="h-4 w-4" />
              </button>
              <Link href="#" className="block text-gray-700 hover:text-gray-900">
                Download
              </Link>
              <Link
                href="https://www.cornellh4i.org/"
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
              >
                About <span className="text-[#1B5E20]">Cornell Hack4Impact</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="w-full text-gray-700" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  className="w-full text-white"
                  style={{ backgroundColor: BRAND }}
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1
              className="mb-6 text-5xl font-bold leading-tight md:text-6xl"
              style={{ color: BRAND }}
            >
              Endowments made manageable
            </h1>
            <p className="mb-8 text-lg text-gray-700">
              Odyssey Fund is the #1 free endowment manager your team will love
            </p>
            <Button
              className="px-8 py-6 text-lg text-white"
               style={{ backgroundColor: "#3E6DA6", color: "white" }}
              asChild
            >
              <Link href="/auth/signup">Get Started for Free</Link>
            </Button>
          </div>
          <div className="flex justify-end">
            <img
              src="/front.png"
              alt="Odyssey workspace"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="container mx-auto px-6 py-12">
        <div className="rounded-full border border-gray-300 px-12 py-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h3 className="text-xl font-semibold">Our Clients</h3>
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className="text-gray-500">
                Nonprofit {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* All in One Dashboard */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="mb-4 text-4xl font-bold" style={{ color: BRAND }}>
          All in One Dashboard
        </h2>
        <p className="mb-8 text-lg text-gray-700">
          Track contributions, monitor activity, and manage funds all in one unified workspace.
        </p>

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-4 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? "border border-gray-300 bg-white text-gray-900 shadow-sm"
                  : "border-0 text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          <img
            src={activeTabData.src}
            alt={activeTabData.label}
            className="-mt-2 h-auto w-full"
          />
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-[#F6F5F8] py-16">
        <div className="container mx-auto px-6">
          <blockquote className="text-center">
            <p className="mb-2 text-2xl text-gray-800">
              &quot;Managing my endowments has never been more fun.&quot;
            </p>
            <footer className="text-xl text-gray-600">– David</footer>
          </blockquote>
        </div>
      </section>

      {/* Grow Your Endowments */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="mb-4 text-4xl font-bold" style={{ color: BRAND }}>
          Grow Your Endowments
        </h2>
        <p className="text-lg text-gray-700">
          Add transactions and visualize growth with real-time insights into your fund performance.
        </p>
      </section>

      {/* A Team Effort */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="mb-4 text-4xl font-bold" style={{ color: BRAND }}>
          A Team Effort
        </h2>
        <p className="mb-12 text-lg text-gray-700">
          Built for collaboration so every member of your team can contribute with confidence.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: "Analytics",
              body: "Designed to give the most valuable insights into your endowment's growth",
            },
            {
              title: "Collaboration",
              body: "No more using multiple platforms. One platform for your analysts and finance teams to track your endowments.",
            },
          ].map((card) => (
            <Card key={card.title} className="border-0 bg-gray-50">
              <CardContent className="p-8 text-center">
                <h3 className="mb-3 text-2xl font-bold">{card.title}</h3>
                <p className="text-gray-700">{card.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* We Prioritize */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-4xl font-bold">We prioritize ...</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: Code, label: "fast implementation" },
              { icon: HelpCircle, label: "quick help" },
              { icon: Lock, label: "protecting your data" },
              { icon: UsersRound, label: "multi-level access" },
              { icon: Zap, label: "smooth onboarding" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3"
              >
                <Icon className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Are We */}
      <section className="container mx-auto px-6 py-16">
        <div className="rounded-2xl bg-[#F6F5F2] px-10 py-14 md:px-16 md:py-16">
          <h2 className="mb-6 text-4xl font-bold">Who are we...?</h2>
          <p className="mb-6 max-w-xl text-lg text-gray-800">
            Team of undergraduate designers and developers looking to help nonprofits do what they do best.
          </p>
          <p className="mb-4 text-lg text-gray-800">
            This product was made with{" "}
            <span className="font-semibold text-[#1B5E20]">{"<3 by Cornell Hack4Impact"}</span>.
          </p>
          <Link
            href="https://www.cornellh4i.org/"
            className="inline-flex items-center gap-2 text-gray-500 underline hover:text-gray-700"
          >
            Learn more about us <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-[#F6F5F8] py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="mb-6 flex items-center gap-2">
                <img src="/logo.png" alt="Odyssey Fund" className="h-7" />
              </Link>
              <div className="flex items-center gap-4">
                <Link href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-gray-900">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" aria-label="Instagram" className="text-gray-600 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.cornellh4i.org/"
                  aria-label="Cornell Hack4Impact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <span className="text-sm font-semibold text-[#1B5E20]">H4I</span>
                </Link>
                <Link href="mailto:hello@odysseyfund.org" aria-label="Email" className="text-gray-600 hover:text-gray-900">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <Link
                href="/auth/signup"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                style={{ backgroundColor: "#3E6DA6", color: "white" }}
              >
                Sign up <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-600 hover:text-gray-900">
                  About
                </Link>
                <Link href="#" className="block text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-600 hover:text-gray-900">
                  Security
                </Link>
                <Link href="#" className="block text-gray-600 hover:text-gray-900">
                  Terms & Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
