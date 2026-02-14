import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, Trophy, Info, ExternalLink, CheckCircle2, Terminal, BookOpen } from "lucide-react";

export default function Red4({ onExit }: { onExit: () => void }) {
  const [flag, setFlag] = useState("");

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between shrink-0">
        <div className="flex gap-3 items-center">
          <Server className="text-red-500" />
          <div>
            <h2 className="text-xl font-bold text-white">RED-4: Persistent XSS</h2>
            <span className="text-xs text-red-400 font-mono">Challenge 4</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="border-slate-700 text-slate-400 hover:bg-slate-800">Exit</Button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><Info className="text-red-500"/> Objective</h3>
            [cite_start]<p className="text-sm leading-relaxed">Inject a persistent XSS payload that executes every time a page is loaded[cite: 241].</p>
          </section>

          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><BookOpen className="text-red-500"/> Background</h3>
            <p className="text-sm">Persistent (Stored) XSS is stored on the server and executes whenever the affected page is viewed. [cite_start]It is more dangerous than reflected XSS [cite: 243-244].</p>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex gap-2"><Terminal className="text-red-500"/> Detailed Instructions</h3>
            <div className="space-y-6 text-sm">
              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 1: Navigate to Customer Feedback</strong>
                [cite_start]<p>Scroll to bottom of homepage and click "Customer Feedback" or go to `/#/contact` [cite: 247-249].</p>
                <Button className="mt-3 bg-red-600 hover:bg-red-700 text-white h-8 text-xs" onClick={() => window.open('https://juice-shop.herokuapp.com/#/contact', '_blank')}>
                   <ExternalLink className="w-3 h-3 mr-2" /> Open Target
                </Button>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 2: Craft XSS Payload</strong>
                [cite_start]<p className="mb-2">In the <strong>Comment</strong> field, enter the payload [cite: 251-252]:</p>
                <code className="block bg-black text-green-400 p-3 rounded border-l-2 border-red-500 font-mono text-xs">
                  &lt;iframe src="javascript:alert('Stored_XSS')"&gt;
                </code>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 3: Submit</strong>
                [cite_start]<p>Fill out required fields (Rating, CAPTCHA) and click Submit [cite: 254-259].</p>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 4: Verify Persistence</strong>
                <p>Refresh the page. [cite_start]The alert should NOT pop up again if Juice Shop sanitizes correctly, but check the Score Board for "API-only XSS" or similar[cite: 263, 271].</p>
              </div>
            </div>
          </section>

          <section className="bg-green-900/10 border border-green-900/30 rounded-xl p-6">
             <h3 className="font-bold text-green-400 mb-4 flex gap-2"><CheckCircle2 className="text-green-500"/> Verification Checklist</h3>
             <ul className="space-y-2 text-sm text-slate-300">
               {[
                 "Submitted XSS payload in feedback form",
                 "Tested persistence (payload stored in database)",
                 "Related XSS challenge marked as Solved",
                 "Submitted flag to Nexus"
               ].map((item, i) => (
                 <li key={i} className="flex gap-2 items-start">
                   [cite_start]<span className="text-green-500 mt-0.5">✓</span> {item} [cite: 284-287]
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
             <p className="text-xs text-slate-500 text-center">Format: NEXUS&#123;XSS_STORED&#125;</p>
           </div>
        </div>
      </div>
    </div>
  );
}