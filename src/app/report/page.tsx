"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Incident Reports</h1>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500">
          Post-incident analysis and reporting interface will be implemented here.
        </div>
      </div>
    </ProtectedRoute>
  );
}
