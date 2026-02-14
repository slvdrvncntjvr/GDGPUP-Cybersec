import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlueProps {
  onExit: () => void;
  title: string;
}

export default function BluePlaceholder({ onExit, title }: BlueProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50">
      <div className="bg-blue-100 p-6 rounded-full mb-6">
        <Shield className="w-16 h-16 text-blue-600" />
      </div>
      <h2 className="text-3xl font-bold text-blue-900 mb-4">Blue Team Interface</h2>
      <p className="text-xl text-muted-foreground text-center max-w-md mb-8">
        The defense simulation environment for <strong>{title}</strong> is currently under construction.
      </p>
      <Button variant="outline" onClick={onExit}>
        Back to Overview
      </Button>
    </div>
  );
}