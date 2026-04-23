import { LogEntry } from "@/lib/types";

export const EventLog = ({ logs }: { logs: LogEntry[] }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">Event Log</h2>
      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="relative pl-6 border-l-2 border-zinc-800 pb-4 last:pb-0">
            <div className="absolute w-3 h-3 bg-zinc-700 rounded-full -left-[7px] top-1.5 border-2 border-zinc-900"></div>
            <div className="text-sm text-zinc-300">{log.message}</div>
            <div className="text-xs text-zinc-500 mt-1">
              {new Date(log.timestamp).toLocaleTimeString()} - {log.actor} ({log.actorRole})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
