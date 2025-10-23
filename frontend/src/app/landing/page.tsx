"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronDown,
  User,
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

export default function OdysseyFundLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <img src="/" alt="CHEM" className="h-8" />
              </Link>
              <nav className="hidden lg:flex items-center gap-6">
                <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                  Product <ChevronDown className="h-4 w-4" />
                </button>
                <Link href="#" className="text-gray-700 hover:text-gray-900">
                  Download
                </Link>
                <Link href="https://www.cornellh4i.org/" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                  About <span className="text-[#1B5E20]">Cornell Hack4Impact</span> <ArrowUpRight className="h-4 w-4" />
                </Link>
              </nav>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" className="text-gray-700">
                Log In
              </Button>
              <Button className="bg-[#4A6FA5] hover:bg-[#3d5a8a] text-white">Sign Up</Button>
            </div>
            <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-4">
              <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 w-full">
                Product <ChevronDown className="h-4 w-4" />
              </button>
              <Link href="#" className="block text-gray-700 hover:text-gray-900">
                Download
              </Link>
              <Link href="https://www.cornellh4i.org/" className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                About <span className="text-[#1B5E20]">Cornell Hack4Impact</span> <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="text-gray-700 w-full">
                  Log In
                </Button>
                <Button className="bg-[#4A6FA5] hover:bg-[#3d5a8a] text-white w-full">Sign Up</Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#4A6FA5] mb-6 leading-tight">
              Endowments made manageable
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              CHEM is the #1 free endowment manager your team will love
            </p>
            <Button className="bg-[#4A6FA5] hover:bg-[#3d5a8a] text-white px-8 py-6 text-lg">
              Get Started for Free
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <img src="/" alt="random pic" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="border border-gray-300 rounded-full py-8 px-12">
          <div className="flex items-center justify-between gap-8 flex-wrap">
            <h3 className="text-2xl font-semibold">Our Clients....</h3>
            <img src="/" alt="logo 1" className="h-10" />
            <img src="/" alt="logo 2" className="h-10" />
            <img src="/" alt="logo 3" className="h-10" />
            <img src="/" alt="logo 4" className="h-10" />
          </div>
        </div>
      </section>

      {/* Product Dashboard Preview Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-[#4A6FA5] mb-4">[Insert One Liner]</h2>
        <p className="text-lg text-gray-700 mb-8">
          gfvdfhghhhjjkkllloiuuopopppp
        </p>

        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "dashboard" ? "border border-gray-300 bg-white" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Product dashboard
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "activity" ? "border border-gray-300 bg-white" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Product activity
          </button>
          <button
            onClick={() => setActiveTab("contributors")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "contributors" ? "border border-gray-300 bg-white" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Product contributors
          </button>
          <button
            onClick={() => setActiveTab("funds")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "funds" ? "border border-gray-300 bg-white" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Product funds
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          {activeTab === "dashboard" && (
            <img src="/" alt="Product Dashboard" className="w-full h-auto rounded-lg" />
          )}
          {activeTab === "activity" && (
            <img src="/" alt="Product Activity" className="w-full h-auto rounded-lg" />
          )}
          {activeTab === "contributors" && (
            <img src="/" alt="Product Contributors" className="w-full h-auto rounded-lg" />
          )}
          {activeTab === "funds" && (
            <img src="/" alt="Product Funds" className="w-full h-auto rounded-lg" />
          )}
        </div>

        <div className="bg-[#F6F5F8] py-12 mt-12 rounded-lg">
          <blockquote className="text-center">
              <p className="text-2xl mb-2">&quot;managing my endowments have never been more fun&quot;</p>
              <footer className="text-xl">– david</footer>
          </blockquote>
        </div>
      </section>

      {/* Product Funds Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-[#4A6FA5] mb-4">[Product Funds One Liner]</h2>
        <p className="text-lg text-gray-700 mb-12">
          tvfggghhjhjjkkkkkkjbnnkkk
        </p>

        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <img src="/product-funds-dashboard-with-chart.jpg" alt="Product Funds Dashboard" className="w-full h-auto rounded-lg" />
        </div>
      </section>

       {/* Product One Liner Section */}
       <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-[#4A6FA5] mb-4">[Insert Product One Liner]</h2>
        <p className="text-lg text-gray-700 mb-12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gray-50 border-0">
            <CardContent className="p-8">
              <div className="bg-white rounded-lg p-6 mb-6 h-64 flex items-center justify-center border border-gray-200">
                <div className="h-12 w-12 mx-auto mb-2 text-gray-400">
                  <img src="/" alt="random pic" className="w-full h-auto rounded-lg" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Analytics</h3>
              <p className="text-gray-700"> Designed to give the most valuable insights into your endowment&apos;s growth</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-0">
            <CardContent className="p-8">
              <div className="bg-white rounded-lg p-6 mb-6 h-64 flex items-center justify-center border border-gray-200">
                <div className="h-12 w-12 mx-auto mb-2 text-gray-400">
                  <img src="/" alt="random pic" className="w-full h-auto rounded-lg" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Collaboration</h3>
              <p className="text-gray-700">
                No more using multiple platforms. One platform for your analysts and finance teams to track your
                endowments.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* We Prioritize Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">We prioritize ...</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-200">
              <Code className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">fast implementation</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-200">
              <HelpCircle className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">quick help</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-200">
              <Lock className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">protecting your data</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-200">
              <UsersRound className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">multi-level access</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-gray-200">
              <Zap className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">smooth onboarding</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section */}
      <section className="bg-[#F6F5F8] py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-6">Who are we...?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Team of undergraduate designers and developers looking to help nonprofits do what they do best.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              This product was made with{" "}
              <span className="text-[#1B5E20] font-semibold">{"<3 by Cornell Hack4Impact"}</span>.
            </p>
            <Link href="https://www.cornellh4i.org/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 underline">
              Learn more about us <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F6F5F8] border-t border-gray-200 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-6">
                <img src="/" alt="CHEM" className="h-8" />
              </Link>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <img src="/" alt="hack4impact" className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <Link href="#" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Sign up <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
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
              <h3 className="font-semibold mb-4">Legal</h3>
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
