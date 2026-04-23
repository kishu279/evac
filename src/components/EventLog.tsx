"use client";

import { useEffect, useRef, useState } from "react";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LogEntry } from "@/lib/types";
import { ShieldAlert, Activity, User, Briefcase } from "lucide-react";

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return <ShieldAlert className="h-3 w-3 text-red-500" />;
    case 'medical': return <Activity className="h-3 w-3 text-green-500" />;
    case 'security': return <Briefcase className="h-3 w-3 text-blue-500" />;
    default: return <User className="h-3 w-3 text-purple-500" />;
  }
};

export const EventLog = ({ incidentId }: { incidentId: string | null }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!incidentId) {
      setLogs([]);
      return;
    }

    const q = query(
      collection(db, "logs"),
      where("incidentId", "==", incidentId),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LogEntry)));
    });

    return () => unsubscribe();
  }, [incidentId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden" style={{ maxHeight: '240px' }}>
      <div className="p-3 border-b border-zinc-800 bg-zinc-950 shrink-0 sticky top-0 z-10">
        <h2 className="text-sm font-bold text-white tracking-widest uppercase">Event Log</h2>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {logs.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm mt-8">
            No events yet — incident log will appear here
          </div>
        ) : (
          logs.map(log => {
            const time = new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return (
              <div key={log.id} className="relative pl-6 border-l border-zinc-800 pb-1">
                <div className="absolute w-2 h-2 bg-zinc-700 rounded-full -left-[4px] top-1.5 border border-zinc-900" />
                <div className="text-sm text-zinc-300 mb-1 leading-snug">{log.message}</div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span>[{time}]</span>
                  <span className="flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                    {getRoleIcon(log.actorRole)}
                    <span className="uppercase">{log.actorRole}</span>
                  </span>
                  <span>{log.actor.split('@')[0]}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
