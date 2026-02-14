import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Crosshair, 
  Trophy, 
  Upload, 
  CheckCircle2, 
  Info,
  Key,
  AlertTriangle
} from "lucide-react";

interface RedGenericProps {
  onExit: () => void;
  room: any;
}

export default function RedGeneric({ onExit, room }: RedGenericProps) {
  const [flagInput, setFlagInput] = useState("");

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-red-50 via-white to-red-50">
      
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md border-b border-red-100 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-2.5 rounded-lg shadow-md shadow-red-200">
            <Crosshair className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{room.title}</h2>
            <div className="flex items-center gap-3 text-sm mt-1">
              <Badge variant="destructive" className="rounded-md px-2 py-0.5 font-bold shadow-sm">
                RED TEAM
              </Badge>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">Advanced Lab</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit} className="text-red-700 hover:bg-red-50">
          Exit Room
        </Button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        {/* MAIN CONTENT */}
        <ScrollArea className="flex-1 h-full">
          <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
            
            {/* INFO CARD */}
            <section className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
              <h3 className="font-bold text-red-950 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-red-500" />
                Room Information
              </h3>
              <p className="text-slate-600 leading-relaxed">{room.description}</p>
            </section>
            
            {/* OBJECTIVES CARD */}
            <section className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
              <h3 className="font-bold text-red-950 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-red-500" />
                Learning Objectives
              </h3>
              <ul className="space-y-3">
                {room.objectives?.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
                {!room.objectives && (
                  <li className="text-slate-400 text-sm italic">No specific objectives listed.</li>
                )}
              </ul>
            </section>

            {/* PLACEHOLDER LAB ENVIRONMENT */}
            <section className="bg-red-50/50 border border-red-200 rounded-xl p-6">
               <h3 className="font-bold text-red-900 mb-4">Lab Environment</h3>
               <div className="bg-white border border-red-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                 <div className="bg-red-50 p-4 rounded-full mb-4">
                   <Crosshair className="w-8 h-8 text-red-500" />
                 </div>
                 <h4 className="font-semibold text-slate-900 mb-2">Advanced Simulation</h4>
                 <p className="text-slate-500 text-sm max-w-md">
                   This advanced room requires a custom VM connection. Please connect via VPN or launch the browser-based terminal.
                 </p>
                 <Button className="mt-4 bg-slate-900 text-white">
                   Launch Terminal
                 </Button>
               </div>
            </section>

          </div>
        </ScrollArea>

        {/* SIDEBAR */}
        <div className="w-full md:w-80 border-l border-red-200 bg-white/90 backdrop-blur shrink-0 md:h-full overflow-y-auto">
          <div className="p-6 sticky top-0">
            <div className="bg-slate-900 p-4 rounded-xl mb-6 text-center shadow-lg shadow-slate-200">
              <h3 className="font-display font-bold text-lg flex items-center justify-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Submission Portal
              </h3>
              <p className="text-xs text-slate-400 mt-1">Validate your flags here</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-red-900 uppercase">Submit Flag</Label>
                 <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="NEXUS{...}" 
                    className="font-mono text-sm pl-9" 
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                  />
                </div>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Validate Flag</Button>
            </div>
             
             <div className="h-px bg-red-100 my-6" />
             
             <div className="space-y-4">
               <Label className="text-xs font-bold text-red-900 uppercase">Proof of Completion</Label>
               <div className="border-2 border-dashed border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-red-50 cursor-pointer transition-colors">
                 <Upload className="w-6 h-6 text-red-400 mb-2" />
                 <span className="text-xs text-slate-500">Upload Screenshot</span>
               </div>
               <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">Submit Screenshot</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}