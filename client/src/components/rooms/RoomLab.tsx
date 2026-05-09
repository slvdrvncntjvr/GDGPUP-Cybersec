import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Flag,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { renderExpectedFlag } from "@shared/challengeCatalog";
import type { RoomLabRendererProps } from "./types";

function flagPlaceholderFor(template: string, teamId: string | null): string {
  if (!teamId) return template.replace(/\$\{TEAM_ID\}/g, "<TEAM_ID>");
  return renderExpectedFlag(template, teamId);
}

export function RoomLab({
  room,
  teamId,
  solvedChallengeIds,
  pendingChallengeId,
  flagInputs,
  onFlagInput,
  onSubmitFlag,
  lessons,
}: RoomLabRendererProps) {
  const isRed = room.team === "red";
  const accent = isRed ? "text-cyber-red" : "text-cyber-blue";
  const buttonVariant = isRed ? "destructive" : "default";

  return (
    <div className="space-y-6">
      {room.externalResources.length > 0 && (
        <section className="rounded-xl border border-border/60 bg-muted/30 p-4">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <ExternalLink className={cn("w-4 h-4", accent)} />
            External Resources
          </h4>
          <div className="flex flex-wrap gap-2">
            {room.externalResources.map((res) => (
              <a
                key={res.url}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 bg-card hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {res.label}
              </a>
            ))}
          </div>
        </section>
      )}

      <section>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <ListChecks className={cn("w-4 h-4", accent)} />
          Challenges &amp; Submissions
        </h4>

        <div className="space-y-4">
          {room.challenges.map((challenge, index) => {
            const completed = solvedChallengeIds.has(challenge.id);
            const lesson = lessons[challenge.id];
            const placeholder = flagPlaceholderFor(challenge.flagTemplate, teamId);
            const inputValue = flagInputs[challenge.id] ?? "";
            const isPending = pendingChallengeId === challenge.id;

            return (
              <div
                key={challenge.id}
                className={cn(
                  "rounded-xl border p-5 transition-colors",
                  completed
                    ? "bg-muted/30 border-border/50"
                    : "bg-card border-border/70"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      completed
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h5
                        className={cn(
                          "font-semibold",
                          completed
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        )}
                      >
                        {challenge.title}
                      </h5>
                      <span className="text-xs text-muted-foreground font-mono">
                        {challenge.points} XP
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.description}
                    </p>
                  </div>
                </div>

                {lesson?.objective && (
                  <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-foreground/90 mb-3">
                    <span className="font-medium">Objective: </span>
                    {lesson.objective}
                  </div>
                )}

                {lesson?.background && (
                  <div className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {lesson.background}
                  </div>
                )}

                {lesson?.steps && lesson.steps.length > 0 && (
                  <ol className="space-y-3 mb-4">
                    {lesson.steps.map((step, stepIdx) => (
                      <li
                        key={stepIdx}
                        className="rounded-md border border-border/50 bg-background/40 p-3"
                      >
                        <div className="flex items-baseline gap-2 mb-2">
                          <span
                            className={cn(
                              "text-xs font-mono font-semibold",
                              accent
                            )}
                          >
                            Step {stepIdx + 1}
                          </span>
                          <span className="font-medium text-foreground">
                            {step.title}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-2">
                          {step.body}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}

                {lesson?.verification && lesson.verification.length > 0 && (
                  <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 mb-4">
                    <div className="font-medium text-emerald-600 dark:text-emerald-400 text-sm mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Verification Checklist
                    </div>
                    <ul className="space-y-1.5">
                      {lesson.verification.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-foreground/80"
                        >
                          <Circle className="w-3 h-3 mt-1 text-emerald-500/70 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lesson?.resources && lesson.resources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lesson.resources.map((res) => (
                      <a
                        key={res.url}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border/60 hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {res.label}
                      </a>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!inputValue.trim() || isPending) return;
                    onSubmitFlag(challenge.id);
                  }}
                  className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] items-stretch"
                >
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor={`flag-${challenge.id}`}
                      className="text-xs font-medium text-muted-foreground flex items-center gap-2"
                    >
                      <Flag className="w-3 h-3" />
                      Submit flag
                    </label>
                    <Input
                      id={`flag-${challenge.id}`}
                      placeholder={placeholder}
                      value={inputValue}
                      onChange={(e) => onFlagInput(challenge.id, e.target.value)}
                      className="font-mono text-sm"
                      data-testid={`flag-input-${challenge.id}`}
                      disabled={completed}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant={buttonVariant}
                    className="self-end gap-1.5"
                    disabled={isPending || !inputValue.trim() || completed}
                    data-testid={`flag-submit-${challenge.id}`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {completed
                      ? "Solved"
                      : isPending
                        ? "Submitting…"
                        : "Validate"}
                  </Button>
                  {!teamId && (
                    <p className="sm:col-span-2 text-xs text-muted-foreground">
                      Log in to populate <Badge variant="outline" className="font-mono mx-1">TEAM_ID</Badge>
                      and submit flags.
                    </p>
                  )}
                </form>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default RoomLab;

export const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[0.85em]">
    {children}
  </code>
);

export const PayloadBlock = ({ children }: { children: React.ReactNode }) => (
  <pre className="overflow-x-auto rounded-md border border-border/60 bg-background/60 p-3 text-xs text-emerald-500 dark:text-emerald-400 font-mono whitespace-pre-wrap">
    {children}
  </pre>
);

export const Bullets = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc list-inside space-y-1">
    {items.map((it, i) => (
      <Fragment key={i}>
        <li>{it}</li>
      </Fragment>
    ))}
  </ul>
);
