"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-500/10 p-3 rounded-full mb-4">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">EVAC PORTAL</h1>
          <p className="text-zinc-400 text-sm mt-2">Sign in to access the emergency dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              placeholder="admin@hotel.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access System"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col gap-2">
          <p>Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>admin@hotel.com</div><div>Admin123</div>
            <div>security@hotel.com</div><div>Security123</div>
            <div>medical@hotel.com</div><div>Medical123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
