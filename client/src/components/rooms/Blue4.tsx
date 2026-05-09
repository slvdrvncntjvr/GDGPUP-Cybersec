import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const BLUE_4_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Walk a simulated compromise through the IR lifecycle (PICERL).",
    background: (
      <p>
        Incident response is choreography. The goal is to move calmly through{" "}
        <em>preparation, identification, containment, eradication, recovery,
        and lessons-learned</em>, preserving evidence at every step.
      </p>
    ),
    steps: [
      {
        title: "Preserve evidence",
        body: (
          <Bullets
            items={[
              <>Snapshot the affected VM before touching anything.</>,
              <>Capture memory if possible; otherwise grab volatile process and network state.</>,
              <>Hash collected artefacts and store them write-once.</>,
            ]}
          />
        ),
      },
      {
        title: "Contain",
        body: (
          <PayloadBlock>{`# example: isolate the host at the network layer\nsudo iptables -A INPUT -j DROP\nsudo iptables -A OUTPUT -j DROP\nsudo iptables -A INPUT -s <IR_console> -j ACCEPT\nsudo iptables -A OUTPUT -d <IR_console> -j ACCEPT`}</PayloadBlock>
        ),
      },
      {
        title: "Eradicate &amp; recover",
        body: (
          <Bullets
            items={[
              <>Remove the persistence (cron, systemd unit, web shell).</>,
              <>Rotate credentials touched by the attacker.</>,
              <>Restore from a clean snapshot rather than cleaning in place.</>,
            ]}
          />
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{IR_PLAYBOOK_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Evidence captured before remediation",
      "Host isolated cleanly",
      "Rotated credentials and removed persistence",
      "Short lessons-learned written up",
    ],
  },
  "ch-2": {
    objective:
      "Lock down a public GCP bucket and verify with an unauthenticated probe.",
    background: (
      <p>
        Cloud defence is the same hygiene as on-prem, just with API calls.
        Removing public IAM bindings, enabling Uniform Bucket-Level Access,
        and turning on access logs makes a bucket meaningfully safer.
      </p>
    ),
    steps: [
      {
        title: "Remove public access",
        body: (
          <PayloadBlock>{`gsutil iam ch -d allUsers:objectViewer gs://<bucket>\ngcloud storage buckets update gs://<bucket> --uniform-bucket-level-access`}</PayloadBlock>
        ),
      },
      {
        title: "Verify",
        body: (
          <PayloadBlock>{`curl -I https://storage.googleapis.com/<bucket>/<known-object>\n# expect 401/403`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{GCP_BUCKET_SECURED_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "All allUsers / allAuthenticatedUsers bindings removed",
      "Uniform bucket-level access enabled",
      "Unauthenticated request returns 401/403",
    ],
  },
};

export default function Blue4Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={BLUE_4_LESSONS} />;
}
