import { AlertTriangle } from "lucide-react";

export const EmergencyBanner = () => {
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-xl flex items-center gap-4 mb-6">
      <AlertTriangle className="h-6 w-6 animate-pulse" />
      <div>
        <h2 className="font-bold text-lg">Active Emergency: FIRE REPORTED</h2>
        <p className="text-sm text-red-400">Location: Floor 3, East Wing. All personnel follow evacuation protocol.</p>
      </div>
    </div>
  );
};
