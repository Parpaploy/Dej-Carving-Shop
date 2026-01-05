"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 1. Import the Context

export default function LoginClient() {
  const router = useRouter();
  const { login } = useAuth(); // 2. Get the login tool

  // 3. DATA STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 4. UI STATES
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 5. LOGIN FUNCTION
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError("");

    try {
      // Connect to Strapi
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`, 
        {
          identifier: email,
          password: password,
        }
      );

      const { jwt, user } = response.data;
      
      // ✅ THE MAGIC PART: Update the Navbar instantly
      login(user, jwt); 

      // Redirect
      router.push("/");
      
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Server connection failed. Is Strapi running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-[#FAF9F6] p-4 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#2e1d10] z-0"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border-t-8 border-[#D4AF37]">
        
        <div className="p-8 pb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif text-[#4B3621] mb-2 font-bold">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Please enter your details to sign in.
          </p>
        </div>

        <div className="p-8 pt-2">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {/* Error Box */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3">
                <AlertCircle className="text-red-500" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Email */}
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-md focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all text-[#2e1d10]"
                />
              </div>
            </div>

            {/* Password */}
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              className={`mt-4 w-full text-white text-xl font-bold py-4 rounded-md shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2
                ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#4B3621] hover:bg-[#2e1d10]"}
              `}
            >
              {isLoading ? "Signing In..." : (
                <>Sign In <ArrowRight size={24} /></>
              )}
            </button>
          </form>
        </div>

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