"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
export default function LoginClient() {
  // State to toggle password visibility (Very helpful for older users)
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements (Subtle Wood Feel) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#2e1d10] z-0"></div>
      
      {/* --- LOGIN CARD --- */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border-t-8 border-[#D4AF37]">
        
        {/* Header Section */}
        <div className="p-8 pb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-[#4B3621] mb-2 font-bold">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Please enter your details to sign in.
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-2">
          <form className="flex flex-col gap-6">
            
            {/* EMAIL INPUT */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-bold text-[#2e1d10]">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37]">
                  <User size={24} />
                </div>
                <input 
                  id="email"
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-[#2e1d10]"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-lg font-bold text-[#2e1d10]">
                  Password
                </label>
                <Link href="#" className="text-sm font-semibold text-[#8B4513] hover:underline underline-offset-4">
                  Forgot Password?
                </Link>
              </div>
              
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37]">
                  <Lock size={24} />
                </div>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-14 py-4 text-lg border-2 border-gray-300 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-[#2e1d10]"
                />
                
                {/* Toggle Visibility Button */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4B3621] p-2"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button className="mt-4 w-full bg-[#4B3621] hover:bg-[#2e1d10] text-white text-xl font-bold py-4 rounded-md shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2">
              Sign In <ArrowRight size={24} />
            </button>
          </form>
        </div>

        {/* --- REGISTER LINK (Distinct Section) --- */}
        <div className="bg-[#FAF9F6] p-6 text-center border-t border-gray-200">
          <p className="text-lg text-gray-700 mb-3">
            Don't have an account yet?
          </p>
          <Link href="/register" className="inline-block border-2 border-[#4B3621] text-[#4B3621] text-lg font-bold py-2 px-6 rounded hover:bg-[#4B3621] hover:text-white transition-colors">
            Create New Account
          </Link>
        </div>

      </div>
    </main>
  );
}