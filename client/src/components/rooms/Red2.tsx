import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Trophy, Info, ExternalLink, CheckCircle2, Terminal, BookOpen } from "lucide-react";

export default function Red2({ onExit }: { onExit: () => void }) {
  const [flag, setFlag] = useState("");

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between shrink-0">
        <div className="flex gap-3 items-center">
          <Database className="text-red-500" />
          <div>
            <h2 className="text-xl font-bold text-white">RED-2: SQLi Data Extraction</h2>
            <span className="text-xs text-red-400 font-mono">Challenge 2</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="border-slate-700 text-slate-400 hover:bg-slate-800">Exit</Button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><Info className="text-red-500"/> Objective</h3>
            <p className="text-sm leading-relaxed">Use UNION-based SQL injection to extract hidden data from the database.</p>
          </section>

          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><BookOpen className="text-red-500"/> Background</h3>
            <p className="text-sm">UNION-based SQL injection allows combining results from multiple SELECT statements, enabling data extraction from other database tables.</p>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex gap-2"><Terminal className="text-red-500"/> Detailed Instructions</h3>
            <div className="space-y-6 text-sm">
              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 1: Find Search Function</strong>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Locate the search bar (top right).</li>
                  <li>Try a normal search: `apple`.</li>
                </ul>
                <Button className="mt-3 bg-red-600 hover:bg-red-700 text-white h-8 text-xs" onClick={() => window.open('https://juice-shop.herokuapp.com', '_blank')}>
                   <ExternalLink className="w-3 h-3 mr-2" /> Open Target
                </Button>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 2: Test for SQL Injection</strong>
                <p className="mb-2">Enter `apple' OR 1=1--`. If vulnerable, you'll see all products instead of just apple-related ones.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 3: Determine Column Count</strong>
                <p className="mb-2">We need to determine the number of columns. For Juice Shop, you need 9 columns.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 4: Extract User Emails</strong>
                <p className="mb-2">Inject the following payload to combine results with the Users table:</p>
                <code className="block bg-black text-green-400 p-3 rounded border-l-2 border-red-500 font-mono text-xs break-all">
                  apple' UNION SELECT NULL, email, password, NULL, NULL, NULL, NULL, NULL, NULL FROM Users--
                </code>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 5: Count Extracted Users</strong>
                <p>Scroll down to see "fake products" containing user emails and password hashes. Count how many unique user emails you see (typically 15-20).</p>
              </div>
            </div>
          </section>

          <section className="bg-green-900/10 border border-green-900/30 rounded-xl p-6">
             <h3 className="font-bold text-green-400 mb-4 flex gap-2"><CheckCircle2 className="text-green-500"/> Verification Checklist</h3>
             <ul className="space-y-2 text-sm text-slate-300">
               {[
                 "Successfully identified column count (9 columns)",
                 "Extracted user emails using UNION SELECT",
                 "Counted total number of users",
                 "Submitted flag with correct user count"
               ].map((item, i) => (
                 <li key={i} className="flex gap-2 items-start">
                   <span className="text-green-500 mt-0.5">✓</span> {item}
                 </li>
               ))}
             </ul>
          </section>
          
          <div className="h-10"></div>
        </div>

        <div className="w-full md:w-80 bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto">
           <div className="bg-black p-4 rounded-xl text-center border border-slate-800 mb-6">
             <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2"/>
             <h3 className="font-bold text-white">Submission</h3>
           </div>
           
           <div className="space-y-4">
             <Label className="text-red-500 font-bold text-xs uppercase">Enter Flag</Label>
             <Input value={flag} onChange={(e) => setFlag(e.target.value)} className="bg-slate-950 border-slate-700 text-white font-mono mt-2" placeholder="NEXUS{...}" />
             <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Validate Flag</Button>
             <p className="text-xs text-slate-500 text-center">Format: NEXUS&#123;SQLI_UNION_17&#125;</p>
           </div>
        </div>
      </div>
    </div>
  );
}