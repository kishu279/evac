"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TaskCard } from "@/components/TaskCard";
import { StaffPanel } from "@/components/StaffPanel";
import { EventLog } from "@/components/EventLog";
import { useFCMToken } from "@/lib/hooks/useFCMToken";

export default function DashboardPage() {
  useFCMToken(); // Register for push notifications

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Command Center</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Active Tasks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stubs for tasks */}
                <TaskCard task={{
                  id: "1", incidentId: "inc1", title: "Evacuate 3rd Floor", 
                  assignedRole: "security", status: "in-progress", priority: "critical", estimatedMinutes: 15
                }} />
                <TaskCard task={{
                  id: "2", incidentId: "inc1", title: "Setup Medical Triage in Lobby", 
                  assignedRole: "medical", status: "pending", priority: "high", estimatedMinutes: 10
                }} />
              </div>
            </div>

            <EventLog logs={[
              { id: "1", incidentId: "inc1", message: "Fire alarm triggered on 3rd floor", actor: "System", actorRole: "system", timestamp: Date.now() - 600000 },
              { id: "2", incidentId: "inc1", message: "Evacuation protocol initiated", actor: "Admin User", actorRole: "admin", timestamp: Date.now() - 500000 }
            ]} />
          </div>

          <div className="space-y-6">
            <StaffPanel staff={[
              { id: "1", name: "Security Officer", role: "security", status: "deployed" },
              { id: "2", name: "Medical Staff", role: "medical", status: "available" }
            ]} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
