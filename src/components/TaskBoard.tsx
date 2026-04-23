"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/lib/types";
import { useAuth } from "./AuthProvider";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

export const TaskBoard = ({ incidentId }: { incidentId: string | null }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    if (!incidentId) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, "tasks"), where("incidentId", "==", incidentId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetched = snapshot.docs.map(d => d.data() as Task);
      
      // Client side role filter
      if (userRole !== 'admin' && userRole !== 'management') {
        fetched = fetched.filter(t => t.assignedRole === userRole);
      }
      
      setTasks(fetched);
    });

    return () => unsubscribe();
  }, [incidentId, userRole]);

  const handleStatusChange = async (task: Task) => {
    if (!currentUser) return;
    
    let newStatus: Task['status'] = 'pending';
    if (task.status === 'pending') newStatus = 'in-progress';
    else if (task.status === 'in-progress') newStatus = 'completed';
    else return; // Don't toggle from completed

    try {
      await updateDoc(doc(db, "tasks", task.id), { status: newStatus });
      
      await addDoc(collection(db, "logs"), {
        incidentId,
        message: `Marked task '${task.title}' as ${newStatus}`,
        actor: currentUser.email,
        actorRole: userRole,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error("Failed to update task", e);
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return 0; // maintain relative order for others
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-zinc-800 shrink-0 bg-zinc-950">
        <h2 className="text-lg font-bold mb-3 text-white tracking-wide">Task Board</h2>
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-1">
          <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="text-xs text-zinc-500 text-right font-bold tracking-wider">
          {completed} / {total} COMPLETED
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedTasks.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm mt-8">No tasks assigned yet.</div>
        ) : (
          sortedTasks.map(t => {
            const isCompleted = t.status === 'completed';
            return (
              <div key={t.id} className={`p-4 rounded-xl border transition-all ${isCompleted ? 'bg-zinc-950/50 border-zinc-800/30 opacity-50' : 'bg-zinc-800/50 border-zinc-700 hover:border-zinc-500'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    t.priority === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    t.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {t.priority}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">~{t.estimatedMinutes}m</span>
                </div>
                
                <h3 className={`font-semibold text-zinc-100 text-sm mb-4 leading-snug ${isCompleted ? 'line-through text-zinc-500' : ''}`}>
                  {t.title}
                </h3>
                
                <button 
                  onClick={() => handleStatusChange(t)}
                  disabled={isCompleted}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    t.status === 'completed' ? 'bg-green-500/20 text-green-500 cursor-not-allowed' :
                    t.status === 'in-progress' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' :
                    'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                  }`}
                >
                  {t.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                  {t.status === 'in-progress' && <PlayCircle className="h-4 w-4 animate-pulse" />}
                  {t.status === 'pending' && <Circle className="h-4 w-4" />}
                  
                  {t.status === 'completed' ? 'Completed' : t.status === 'in-progress' ? 'In Progress' : 'Start Task'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
