"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function RegisterClient() {
  const router = useRouter();

  // 1. DATA STATES
  // Strapi requires a 'username' by default, so we ask for Full Name to use as username
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 2. UI STATES
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 3. REGISTER FUNCTION
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Step A: Validate Passwords Match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check again.");
      setIsLoading(false);
      return;
    }

    try {
      // Step B: Send to Strapi
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local/register`,
        {
          username: username, // Strapi requirement
          email: email,
          password: password,
        }
      );

      // Step C: Success! Auto-Login the user
      const { jwt, user } = response.data;
      
      // Save Token to LocalStorage
      localStorage.setItem("jwt", jwt);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to Home
      router.push("/");

    } catch (err: any) {
      console.error("Registration Error:", err);
      
      // Step D: Handle Specific Strapi Errors
      // Strapi often sends details inside err.response.data.error.message
      const strapiError = err.response?.data?.error?.message;

      if (strapiError === "Email or Username are already taken") {
        setError("This email is already registered. Please Log In.");
      } else if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
      } else {
        setError("Registration failed. Please try again or check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 relative overflow-hidden">
      
      {/* Decorative Wood Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#2e1d10] z-0"></div>

      <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-2xl overflow-hidden border-t-8 border-[#D4AF37]">
        
        {/* Header */}
        <div className="p-8 pb-2 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-[#4B3621] mb-2 font-bold">
            Join the Collectors
          </h1>
          <p className="text-lg text-gray-600">
            Create an account to verify authenticity and track orders.
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-4">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">

            {/* ERROR ALERT */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            {/* 1. FULL NAME (Mapped to Username) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="fullname" className="text-lg font-bold text-[#2e1d10]">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37]">
                  <User size={24} />
                </div>
                <input 
                  id="fullname"
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Somchai Jai-dee"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-[#2e1d10]"
                />
              </div>
            </div>

            {/* 2. EMAIL */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-bold text-[#2e1d10]">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37]">
                  <Mail size={24} />
                </div>
                <input 
                  id="email"
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-[#2e1d10]"
                />
              </div>
            </div>

            {/* 3. PASSWORD */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-lg font-bold text-[#2e1d10]">
                Create Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37]">
                  <Lock size={24} />
                </div>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-12 pr-14 py-4 text-lg border-2 border-gray-300 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-[#2e1d10]"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4B3621] p-2"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* 4. CONFIRM PASSWORD */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-lg font-bold text-[#2e1d10]">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37]">
                  <CheckCircle size={24} />
                </div>
                <input 
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-12 pr-14 py-4 text-lg border-2 border-gray-300 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-[#2e1d10]"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4B3621] p-2"
                >
                  {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              disabled={isLoading}
              className={`mt-4 w-full text-[#2e1d10] text-xl font-bold py-4 rounded-md shadow-lg transform transition active:scale-95
                 ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#D4AF37] hover:bg-[#b5952f]"}
              `}
            >
              {isLoading ? "Creating Account..." : "Create My Account"}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="bg-[#FAF9F6] p-6 text-center border-t border-gray-200">
          <p className="text-lg text-gray-700 mb-2">
            Already have an account?
          </p>
          <Link href="/login" className="text-xl font-bold text-[#4B3621] border-b-2 border-[#4B3621] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
            Log In Here
          </Link>
        </div>

      </div>
    </main>
  );
}