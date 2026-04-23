"use client";

import { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { doc, updateDoc } from "firebase/firestore";
import { rtdb, db } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Incident } from "@/lib/types";

export const EmergencyBanner = () => {
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    const incidentRef = ref(rtdb, 'activeIncident');
    const unsubscribe = onValue(incidentRef, (snapshot) => {
      if (snapshot.exists()) {
        setActiveIncident(snapshot.val());
      } else {
        setActiveIncident(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResolve = async () => {
    if (!activeIncident || userRole !== 'admin') return;
    
    try {
      // Clear RTDB
      await set(ref(rtdb, 'activeIncident'), null);
      
      // Update Firestore
      const incidentRef = doc(db, 'incidents', activeIncident.id);
      await updateDoc(incidentRef, {
        status: 'resolved',
        resolvedAt: Date.now()
      });
    } catch (error) {
      console.error("Failed to resolve incident", error);
    }
  };

  if (!activeIncident) return null;

  const minutesAgo = Math.floor((Date.now() - activeIncident.createdAt) / 60000);

  return (
    <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between sticky top-[73px] z-40 shadow-lg border-b border-red-700 w-full">
      <div className="flex items-center gap-4">
        {/* Pulsing dot */}
        <div className="w-3 h-3 bg-white rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
        
        <AlertTriangle className="h-6 w-6" />
        <div className="font-bold tracking-wide">
          ACTIVE: {activeIncident.type} — {activeIncident.location} — declared {minutesAgo === 0 ? "just now" : `${minutesAgo} mins ago`}
        </div>
      </div>

      {userRole === 'admin' && (
        <button
          onClick={handleResolve}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 transition-colors px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm"
        >
          <CheckCircle2 className="h-4 w-4" />
          RESOLVE
        </button>
      )}
    </div>
  );
};
