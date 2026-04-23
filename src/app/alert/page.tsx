"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AlertPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Trigger Emergency Alert</h1>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-zinc-400 mb-6">Use this form to manually trigger an emergency alert. This will notify all relevant personnel immediately.</p>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Emergency Type</label>
              <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500">
                <option value="FIRE">Fire</option>
                <option value="MEDICAL">Medical Emergency</option>
                <option value="DISASTER">Natural Disaster</option>
                <option value="SECURITY">Security Threat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Location</label>
              <input type="text" placeholder="e.g. Lobby, Floor 3" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500" />
            </div>

            <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors uppercase tracking-widest mt-4">
              Trigger Alert
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
