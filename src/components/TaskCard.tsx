import { getRoleColor } from "./Navbar";
import { Task } from "@/lib/types";

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-zinc-100">{task.title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${getRoleColor(task.assignedRole)}`}>
          {task.assignedRole}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">Status: <span className="text-zinc-200 capitalize">{task.status}</span></span>
        <span className="text-zinc-400">Priority: <span className="text-orange-400 capitalize">{task.priority}</span></span>
      </div>
    </div>
  );
};
