import { StaffMember } from "@/lib/types";
import { getRoleColor } from "./Navbar";

export const StaffPanel = ({ staff }: { staff: StaffMember[] }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Active Personnel</h2>
      <div className="space-y-3">
        {staff.map(s => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
            <div>
              <div className="font-medium text-zinc-200">{s.name}</div>
              <div className="text-xs text-zinc-500 capitalize">{s.status}</div>
            </div>
            <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${getRoleColor(s.role)}`}>
              {s.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
