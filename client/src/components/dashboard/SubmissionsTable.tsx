import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Submission } from "./types";

type Props = {
  submissions: Submission[];
  searchValue: string;
  onSearchChange: (value: string) => void;
};

function StatusPill({ status }: { status: "Success" | "Fail" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
        status === "Success"
          ? "bg-primary/10 text-primary"
          : "bg-cyber-red/10 text-cyber-red"
      )}
    >
      {status}
    </span>
  );
}

function formatTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function SubmissionsTable({
  submissions,
  searchValue,
  onSearchChange,
}: Props) {
  const q = searchValue.trim().toLowerCase();
  const filtered = submissions.filter((s) => {
    if (!q) return true;
    return (
      s.status.toLowerCase().includes(q) ||
      s.roomName.toLowerCase().includes(q) ||
      (s.roomCode ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <section>
      <div className="mb-3 inline-flex rounded-md bg-muted px-3 py-1 text-sm font-medium">
        My Submissions
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flag className="h-4 w-4" />
              Recent attempts across rooms
            </div>

            <div className="w-full sm:w-72">
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by room or status…"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border/50 p-6 text-sm text-muted-foreground">
              No submissions yet — head over to the Rooms page and try a flag.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Result</TableHead>
                  <TableHead className="w-[40%]">Room</TableHead>
                  <TableHead className="w-[20%]">Code</TableHead>
                  <TableHead className="w-[20%]">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell>
                      <StatusPill status={s.status} />
                    </TableCell>
                    <TableCell className="text-sm">{s.roomName}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {s.roomCode ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatTime(s.submittedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
