import { useState } from "react";
import RoomDetailModal from "../RoomDetailModal";
import { Button } from "@/components/ui/button";
import { mapCatalogRoomToContent } from "@shared/content";
import { ROOMS_CATALOG } from "@shared/challengeCatalog";

const sampleRoom = mapCatalogRoomToContent(ROOMS_CATALOG[0]);

export default function RoomDetailModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-8 bg-background min-h-screen">
      <Button onClick={() => setOpen(true)}>Open Room Details</Button>
      <RoomDetailModal
        open={open}
        onOpenChange={setOpen}
        room={sampleRoom}
        solvedChallengeIds={[]}
      />
    </div>
  );
}
