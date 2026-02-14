import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, Trophy, Info, ExternalLink, CheckCircle2, BookOpen } from "lucide-react";

export default function Red3({ onExit }: { onExit: () => void }) {
  const [flag, setFlag] = useState("");

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between shrink-0">
        <div className="flex gap-3 items-center">
          <Terminal className="text-red-500" />
          <div>
            <h2 className="text-xl font-bold text-white">RED-3: Reflected XSS</h2>
            <span className="text-xs text-red-400 font-mono">Challenge 3</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="border-slate-700 text-slate-400 hover:bg-slate-800">Exit</Button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><Info className="text-red-500"/> Objective</h3>
            <p className="text-sm leading-relaxed">Execute a reflected XSS attack by injecting JavaScript into the search parameter.</p>
          </section>

          <section className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-2 flex gap-2"><BookOpen className="text-red-500"/> Background</h3>
            <p className="text-sm">Reflected XSS occurs when user input is immediately returned by the web application without sanitization, allowing script execution in the victim's browser.</p>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4 flex gap-2"><Terminal className="text-red-500"/> Detailed Instructions</h3>
            <div className="space-y-6 text-sm">
              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 1: Identify Vulnerability</strong>
                <p>The search function is vulnerable to XSS.</p>
                <Button className="mt-3 bg-red-600 hover:bg-red-700 text-white h-8 text-xs" onClick={() => window.open('https://juice-shop.herokuapp.com', '_blank')}>
                   <ExternalLink className="w-3 h-3 mr-2" /> Open Target
                </Button>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 2: Test Basic XSS</strong>
                <p className="mb-2">In the search bar, enter the following payload:</p>
                <code className="block bg-black text-green-400 p-3 rounded border-l-2 border-red-500 font-mono text-xs">
                  &lt;script&gt;alert('XSS')&lt;/script&gt;
                </code>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 3: Advanced Payload (iframe)</strong>
                <p className="mb-2">Try this payload to complete the challenge:</p>
                <code className="block bg-black text-green-400 p-3 rounded border-l-2 border-red-500 font-mono text-xs">
                  &lt;iframe src="javascript:alert('XSS')"&gt;
                </code>
              </div>

              <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <strong className="text-white block mb-2">Step 4: Verify Success</strong>
                <p>An alert box should pop up with "XSS". Go to the Score Board to confirm "Reflected XSS" is solved.</p>
              </div>
            </div>
          </section>

          <section className="bg-green-900/10 border border-green-900/30 rounded-xl p-6">
             <h3 className="font-bold text-green-400 mb-4 flex gap-2"><CheckCircle2 className="text-green-500"/> Verification Checklist</h3>
             <ul className="space-y-2 text-sm text-slate-300">
               {[
                 "Successfully executed JavaScript in browser via search",
                 "Displayed session cookie or alert box",
                 "XSS challenge marked as Solved on Score Board",
                 "Submitted flag to Nexus"
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
             <p className="text-xs text-slate-500 text-center">Format: NEXUS&#123;XSS_REFLECTED&#125;</p>
           </div>
        </div>
      </div>
    </div>
  );
}