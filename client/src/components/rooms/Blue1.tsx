import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const BLUE_1_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Enable a host firewall so only the ports the system needs are reachable.",
    background: (
      <p>
        A default Linux install often listens on more ports than the workload
        actually needs. Turning on a firewall and explicitly allowing only the
        required services is the cheapest meaningful improvement to a host's
        attack surface.
      </p>
    ),
    steps: [
      {
        title: "Inventory listeners",
        body: <PayloadBlock>{`ss -tulpn`}</PayloadBlock>,
      },
      {
        title: "Enable UFW with a deny-by-default policy",
        body: (
          <PayloadBlock>{`sudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow OpenSSH\nsudo ufw enable\nsudo ufw status verbose`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{HOST_FIREWALL_<TEAM_ID>}`}</InlineCode> when
            UFW is active and only the expected ports are open.
          </p>
        ),
      },
    ],
    verification: [
      "UFW (or equivalent) is active",
      "Only required ports are reachable",
      "A connection attempt to a denied port times out",
    ],
  },
  "ch-2": {
    objective:
      "Disable at least three unnecessary services on the lab VM.",
    background: (
      <p>
        Every running service is potential attack surface. Defaults often
        include print servers, Avahi, Bluetooth, etc. — none of which a
        server host needs.
      </p>
    ),
    steps: [
      {
        title: "List enabled units",
        body: (
          <PayloadBlock>{`systemctl list-unit-files --state=enabled\nsystemctl list-units --type=service --state=running`}</PayloadBlock>
        ),
      },
      {
        title: "Stop and disable",
        body: (
          <PayloadBlock>{`sudo systemctl disable --now cups\nsudo systemctl disable --now avahi-daemon\nsudo systemctl disable --now bluetooth`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{SERVICES_HARDENED_<TEAM_ID>}`}</InlineCode>{" "}
            once at least three services have been disabled and the VM still
            boots cleanly.
          </p>
        ),
      },
    ],
    verification: [
      "At least three services disabled",
      "Justification documented for each removal",
      "VM still reaches a stable state on reboot",
    ],
  },
  "ch-3": {
    objective:
      "Apply a sensible password / lockout policy and verify enforcement.",
    background: (
      <p>
        Weak password defaults are still the #1 cause of intrusions in lab
        environments. PAM lets you set length, complexity, and lockout in one
        place.
      </p>
    ),
    steps: [
      {
        title: "Configure PAM password requirements",
        body: (
          <PayloadBlock>{`sudo nano /etc/security/pwquality.conf\n# minlen = 12\n# minclass = 3\n# difok = 4`}</PayloadBlock>
        ),
      },
      {
        title: "Lock out brute force",
        body: (
          <PayloadBlock>{`sudo nano /etc/security/faillock.conf\n# deny = 5\n# unlock_time = 900`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <Bullets
            items={[
              <>Force a password change for a test user.</>,
              <>Try a password that violates the new rule and confirm rejection.</>,
              <>Submit <InlineCode>{`NEXUS{PASSWORD_POLICY_<TEAM_ID>}`}</InlineCode>.</>,
            ]}
          />
        ),
      },
    ],
    verification: [
      "Password complexity policy active",
      "Lockout policy active",
      "Test account confirms enforcement",
    ],
  },
};

export default function Blue1Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={BLUE_1_LESSONS} />;
}
