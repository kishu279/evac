"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Task Management</h1>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500">
          Task assignment and tracking interface will be implemented here.
        </div>
      </div>
    </ProtectedRoute>
  );
}
