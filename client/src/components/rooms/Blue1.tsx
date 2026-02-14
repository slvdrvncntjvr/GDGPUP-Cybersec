import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Trophy, Info, BookOpen, CheckCircle2, Terminal } from "lucide-react";

export default function Blue1({ onExit }: { onExit: () => void }) {
  const [flag, setFlag] = useState("");

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      {/* Header - BLUE ACCENTS */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between shrink-0">
        <div className="flex gap-3 items-center">
          <Shield className="text-blue-500" />
          <div>
            <h2 className="text-xl font-bold text-white">BLUE-1: SIEM Alert Triage</h2>
            <span className="text-xs text-blue-400 font-mono">Placeholder</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="border-slate-700 text-slate-400 hover:bg-slate-800">Exit</Button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Overview */}
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><Info className="text-blue-500"/> Overview</h3>
            <p className="text-sm leading-relaxed text-slate-400">Analyze logs to identify and classify suspicious authentication events.</p>
          </section>

          {/* Background */}
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><BookOpen className="text-blue-500"/> Background</h3>
            <p className="text-sm text-slate-500 italic">Content pending...</p>
          </section>

          {/* Instructions */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex gap-2"><Terminal className="text-blue-500"/> Detailed Instructions</h3>
            <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-lg">
               <Shield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
               <p className="text-slate-500 font-medium">Lab Environment Construction in Progress</p>
            </div>
          </section>

          {/* Verification */}
          <section className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-6">
             <h3 className="font-bold text-blue-400 mb-2 flex gap-2"><CheckCircle2 className="text-blue-500"/> Verification Checklist</h3>
             <ul className="space-y-1 text-sm text-slate-500 italic">
               <li>[Pending verification steps]</li>
             </ul>
          </section>
          <div className="h-10"></div>
        </div>

        <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
           <div className="bg-black p-4 rounded-xl text-center border border-slate-800 mb-6">
             <Trophy className="w-6 h-6 text-blue-500 mx-auto mb-2"/>
             <h3 className="font-bold text-white">Submission</h3>
           </div>
           <div className="text-center text-slate-500 text-xs mt-10">
             Submissions unavailable.
           </div>
        </div>
      </div>
    </div>
  );
}