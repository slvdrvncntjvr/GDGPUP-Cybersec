import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const BLUE_2_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Identify a SYN flood inside a packet capture and quantify it.",
    background: (
      <p>
        SYN floods exhaust a server's TCP listen queue by spraying many{" "}
        <InlineCode>SYN</InlineCode> segments without finishing the handshake.
        In a capture you'll see a sea of <InlineCode>S</InlineCode> flags
        without matching <InlineCode>SYN/ACK</InlineCode>+<InlineCode>ACK</InlineCode>{" "}
        replies.
      </p>
    ),
    steps: [
      {
        title: "Filter the capture",
        body: (
          <>
            <p>In Wireshark, apply:</p>
            <PayloadBlock>{`tcp.flags.syn == 1 && tcp.flags.ack == 0`}</PayloadBlock>
            <p>
              Compare against the same filter ANDed with{" "}
              <InlineCode>tcp.flags.ack == 1</InlineCode>: a healthy ratio is
              roughly 1:1.
            </p>
          </>
        ),
      },
      {
        title: "Quantify",
        body: (
          <Bullets
            items={[
              <>Count SYN packets per source within a 1-second window.</>,
              <>Identify the top source IPs (likely a few addresses doing the bulk of traffic).</>,
              <>Note the destination port being targeted.</>,
            ]}
          />
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{SYN_FLOOD_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Located the SYN-heavy time window",
      "Top source IPs identified",
      "Target port noted in the report",
    ],
  },
  "ch-2": {
    objective:
      "Find the malicious HTTP request inside the capture and explain its intent.",
    background: (
      <p>
        Web shells, SQL injection probes, and command-execution bait often
        show up in plain text inside HTTP requests. A simple substring filter
        is enough to surface them.
      </p>
    ),
    steps: [
      {
        title: "Surface plain HTTP",
        body: (
          <PayloadBlock>{`http.request and (http.request.uri contains "select" or http.request.uri contains "../" or http.request.uri contains "cmd")`}</PayloadBlock>
        ),
      },
      {
        title: "Pivot on a hit",
        body: (
          <Bullets
            items={[
              <>Right-click → Follow → HTTP Stream.</>,
              <>Look for shell output, command echoes, or extra script tags in the response body.</>,
            ]}
          />
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{MAL_HTTP_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Identified the malicious request URL/body",
      "Followed the conversation to confirm the response",
      "Documented the intent (RCE, SQLi, web shell, etc.)",
    ],
  },
};

export default function Blue2Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={BLUE_2_LESSONS} />;
}
