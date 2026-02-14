import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Red Rooms
import Red1 from "./rooms/Red1";
import Red2 from "./rooms/Red2";
import Red3 from "./rooms/Red3";
import Red4 from "./rooms/Red4";

// Blue Rooms
import Blue1 from "./rooms/Blue1";
import Blue2 from "./rooms/Blue2"; // Ensure these files exist
import Blue3 from "./rooms/Blue3";
import Blue4 from "./rooms/Blue4";

interface RoomDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: any;
}

export default function RoomDetailModal({ open, onOpenChange, room }: RoomDetailModalProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const Icon = room.icon;

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setHasStarted(false);
    onOpenChange(isOpen);
  };

  if (hasStarted) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {/* ADDED 'flex flex-col' HERE TO FIX SCROLLING */}
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 flex flex-col overflow-hidden bg-slate-950 border-slate-800">
           <div className="flex-1 h-full min-h-0">
             {room.id === 'red-1' ? <Red1 onExit={() => setHasStarted(false)} /> :
              room.id === 'red-2' ? <Red2 onExit={() => setHasStarted(false)} /> :
              room.id === 'red-3' ? <Red3 onExit={() => setHasStarted(false)} /> :
              room.id === 'red-4' ? <Red4 onExit={() => setHasStarted(false)} /> :
              room.id === 'blue-1' ? <Blue1 onExit={() => setHasStarted(false)} /> :
              room.id === 'blue-2' ? <Blue2 onExit={() => setHasStarted(false)} /> :
              room.id === 'blue-3' ? <Blue3 onExit={() => setHasStarted(false)} /> :
              room.id === 'blue-4' ? <Blue4 onExit={() => setHasStarted(false)} /> :
              (
               <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                      <p className="text-xl font-bold text-red-500">Error</p>
                      <p className="text-slate-400">Content for {room.id} not found.</p>
                      <Button onClick={() => setHasStarted(false)} variant="outline" className="mt-4">Go Back</Button>
                  </div>
               </div>
             )}
           </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Overview View
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className={cn("relative h-32 flex items-end p-6", room.team === "blue" ? "bg-blue-900/20" : "bg-red-900/20")}>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => handleOpenChange(false)}>
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-md flex items-center justify-center", room.team === "blue" ? "bg-blue-100/10 text-blue-500" : "bg-red-100/10 text-red-500")}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{room.title}</DialogTitle>
              <DialogDescription>{room.team === "blue" ? "Defense Track" : "Offense Track"}</DialogDescription>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground mb-6">{room.description}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>Close</Button>
            <Button onClick={() => setHasStarted(true)} className="gap-2">Start Room <ArrowRight className="w-4 h-4"/></Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}