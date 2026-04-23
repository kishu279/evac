"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StaffMember } from "@/lib/types";
import { useAuth } from "./AuthProvider";

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin": return "bg-red-500 text-red-950";
    case "security": return "bg-blue-500 text-blue-950";
    case "medical": return "bg-green-500 text-green-950";
    case "management": return "bg-purple-500 text-purple-950";
    default: return "bg-zinc-500 text-zinc-950";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "available": return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]";
    case "deployed": return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]";
    case "unavailable": return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
    default: return "bg-zinc-500";
  }
};

export const StaffPanel = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "staff"), (snapshot) => {
      setStaffList(snapshot.docs.map((doc) => doc.data() as StaffMember));
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!currentUser) return;
    const newStatus = e.target.value;
    try {
      await updateDoc(doc(db, "staff", currentUser.uid), { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const currentStaff = staffList.find(s => s.id === currentUser?.uid);
  const available = staffList.filter(s => s.status === 'available').length;
  const deployed = staffList.filter(s => s.status === 'deployed').length;
  const unavailable = staffList.filter(s => s.status === 'unavailable').length;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-zinc-800 shrink-0">
        <h2 className="text-lg font-bold mb-3 text-white tracking-wide">Staff Status</h2>
        <div className="flex justify-between items-center bg-zinc-950 p-2 rounded-lg text-xs font-bold text-zinc-400">
          <span className="text-green-500">{available} Avail</span>
          <span className="text-yellow-500">{deployed} Deployed</span>
          <span className="text-red-500">{unavailable} Unavail</span>
        </div>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-3">
        {staffList.map((s) => {
          const initials = s.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?';
          return (
            <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRoleColor(s.role)}`}>
                  {initials}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-950 ${getStatusColor(s.status)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-200 text-sm truncate">{s.name}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">{s.role}</div>
              </div>
            </div>
          );
        })}
      </div>

      {currentStaff && (
        <div className="p-4 border-t border-zinc-800 shrink-0 bg-zinc-950">
          <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Update My Status</label>
          <select 
            value={currentStaff.status}
            onChange={handleStatusChange}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="available">Available</option>
            <option value="deployed">Deployed</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      )}
    </div>
  );
};
