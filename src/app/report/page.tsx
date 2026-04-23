"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Incident } from "@/lib/types";
import { FileText, Printer, Copy, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<string>("");
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIncidents = async () => {
      const q = query(collection(db, "incidents"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setIncidents(snapshot.docs.map(d => d.data() as Incident));
    };
    fetchIncidents();
  }, []);

  const generateReport = async () => {
    if (!selectedIncident) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId: selectedIncident })
      });
      const data = await res.json();
      if (data.report) setReport(data.report);
      else toast.error(data.error || "Generation failed.");
    } catch (e) {
      toast.error("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    toast.success("Copied to clipboard!");
  };

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-5xl mx-auto w-full">
        <div className="print:hidden">
          <h1 className="text-2xl font-bold mb-6">Incident Reports</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Select Incident</label>
              <select 
                value={selectedIncident} 
                onChange={e => setSelectedIncident(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
              >
                <option value="">-- Select an incident --</option>
                {incidents.map(inc => (
                  <option key={inc.id} value={inc.id}>
                    {new Date(inc.createdAt).toLocaleString()} - {inc.type} at {inc.location}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={generateReport}
              disabled={!selectedIncident || loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 h-[50px]"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
              Generate Report
            </button>
          </div>
        </div>

        {report && (
          <div className="space-y-4">
            <div className="flex justify-end gap-3 print:hidden">
              <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors">
                <Copy className="h-4 w-4" /> Copy
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors">
                <Printer className="h-4 w-4" /> Print
              </button>
            </div>
            
            <div className="bg-white text-black p-8 sm:p-12 rounded-xl shadow-2xl font-serif text-lg leading-relaxed whitespace-pre-wrap print:p-0 print:shadow-none print:bg-transparent">
              {report}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body { background: white; color: black; }
          nav, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </ProtectedRoute>
  );
}
