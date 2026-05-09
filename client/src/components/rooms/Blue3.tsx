import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const BLUE_3_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Author a Snort/Suricata signature that fires on the lab IOC.",
    background: (
      <p>
        Signature-based detection is brittle, but it is also the cheapest way
        to get an immediate alert when a known IOC shows up. The art is in
        keeping signatures specific enough to avoid noise.
      </p>
    ),
    steps: [
      {
        title: "Pick the IOC",
        body: (
          <Bullets
            items={[
              <>From BLUE-2 you should already have a payload string or URI in mind.</>,
              <>Pick something stable: a unique URI path or a header substring.</>,
            ]}
          />
        ),
      },
      {
        title: "Write the rule",
        body: (
          <PayloadBlock>{`alert http any any -> $HOME_NET any (\n  msg:"GDG-Lab webshell URI";\n  flow:to_server,established;\n  http.uri; content:"/cmd.php";\n  classtype:web-application-attack;\n  sid:1000001; rev:1;\n)`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Replay the capture against your IDS, confirm the alert fires, and
            submit <InlineCode>{`NEXUS{IDS_SIGNATURE_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Rule loaded by Snort/Suricata without errors",
      "Alert fires on the malicious request and not on benign traffic",
      "SID is non-conflicting",
    ],
  },
  "ch-2": {
    objective:
      "Build a SIEM correlation rule that ties the IDS hit to a recent auth failure.",
    background: (
      <p>
        Single-source detections create alert fatigue. Correlation rules are
        what convert raw events into a story analysts can triage.
      </p>
    ),
    steps: [
      {
        title: "Ingest two sources",
        body: (
          <Bullets
            items={[
              <>Send IDS alerts and authentication logs into the SIEM.</>,
              <>Confirm both indices are queryable.</>,
            ]}
          />
        ),
      },
      {
        title: "Correlate",
        body: (
          <PayloadBlock>{`# pseudocode\nIF (auth_failed FROM src_ip in last 5m) > 5\nAND (ids_alert FROM src_ip in last 5m) >= 1\nTHEN alert("possible compromise from " + src_ip)`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{SIEM_CORRELATION_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Both event sources ingested",
      "Correlation rule fires on the lab scenario",
      "Alert is enriched with the source IP and a short story",
    ],
  },
};

export default function Blue3Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={BLUE_3_LESSONS} />;
}
