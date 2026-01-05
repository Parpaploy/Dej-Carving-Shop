import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FAF9F6] z-50">
      {/* Animated Spinner */}
      <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mb-4" />
      
      {/* Reassuring Text */}
      <h2 className="text-2xl font-serif text-[#4B3621] font-bold animate-pulse">
        Loading Collection...
      </h2>
    </div>
  );
}