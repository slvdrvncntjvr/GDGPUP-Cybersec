import { describe, expect, it } from "vitest";
import { formatTeamId } from "./storage.ts";

describe("formatTeamId", () => {
  it("pads short sequence numbers without truncating past 99", () => {
    expect(formatTeamId(1)).toBe("TEAM01");
    expect(formatTeamId(10)).toBe("TEAM10");
    expect(formatTeamId(99)).toBe("TEAM99");
    expect(formatTeamId(100)).toBe("TEAM100");
    expect(formatTeamId(1000)).toBe("TEAM1000");
  });

  it("never collides TEAMS for seq 10 vs 100", () => {
    expect(formatTeamId(10)).not.toBe(formatTeamId(100));
  });

  it("formats 500 distinct sequential ids uniquely", () => {
    const ids = new Set<string>();
    for (let n = 1; n <= 500; n++) ids.add(formatTeamId(n));
    expect(ids.size).toBe(500);
  });
});
