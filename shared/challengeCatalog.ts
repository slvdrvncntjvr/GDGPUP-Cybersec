import type { Team } from "./schema";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RoomCode =
  | "RED-1"
  | "RED-2"
  | "RED-3"
  | "RED-4"
  | "BLUE-1"
  | "BLUE-2"
  | "BLUE-3"
  | "BLUE-4";

export type Session = 5 | 6 | 8 | 9 | 10 | 11 | 12;

export interface CatalogChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  /**
   * Flag template. Use the literal placeholder `${TEAM_ID}` where the user's
   * team identifier should be substituted at validation time.
   * Example: "NEXUS{SQLI_ADMIN_${TEAM_ID}}"
   */
  flagTemplate: string;
}

export interface CatalogResource {
  label: string;
  url: string;
}

export interface CatalogRoom {
  id: string;
  roomCode: RoomCode;
  session: Session;
  title: string;
  description: string;
  team: Team;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  participants: number;
  tags: string[];
  prerequisites?: string[];
  objectives?: string[];
  externalResources?: CatalogResource[];
  challenges: CatalogChallenge[];
}

// ─── PDF-aligned Catalog ─────────────────────────────────────────────────────
//
// Source of truth: `pdf/Cybersecurity Rooms Content Docu (1).pdf` and
// `pdf/Copy of GDG '26 Cybersecurity Hands-on Online Trainings Resource.pdf`.
//
// Eight rooms tied to the GDG '26 Cybersecurity track sessions:
//   RED-1  Session 5  Web Exploitation         (5 challenges, 100 XP)
//   RED-2  Session 9  Advanced Web Exploits    (file upload, SSRF, IDOR)
//   RED-3  Session 11 Cloud Attacks            (cloud misconfig, bucket enum)
//   RED-4              Reserved for future content
//   BLUE-1 Session 6  Host & Network Hardening
//   BLUE-2 Session 8  Monitoring & Packet Analysis
//   BLUE-3 Session 10 IDS/IPS & SIEM Fundamentals
//   BLUE-4 Session 12 Incident Response & Cloud Defense

export const ROOMS_CATALOG: CatalogRoom[] = [
  {
    id: "red-1-web-exploitation",
    roomCode: "RED-1",
    session: 5,
    title: "Web Exploitation",
    description:
      "Identify and exploit common OWASP Top 10 vulnerabilities (SQLi, XSS, auth bypass) on OWASP Juice Shop.",
    team: "red",
    difficulty: "Beginner",
    duration: "90-120 min",
    participants: 0,
    tags: ["Red Team", "Web", "OWASP", "SQLi", "XSS"],
    prerequisites: [
      "Basic HTTP request/response understanding",
      "Familiarity with browser developer tools",
      "Basic SQL knowledge (helpful, not required)",
    ],
    objectives: [
      "Identify SQL injection vulnerabilities in login forms and search fields",
      "Exploit SQL injection to bypass authentication",
      "Extract sensitive data via UNION-based SQL injection",
      "Differentiate between Reflected and Stored XSS attacks",
      "Execute XSS payloads to demonstrate session theft",
      "Explain OWASP Top 10 real-world impact and remediation",
    ],
    externalResources: [
      { label: "OWASP Juice Shop", url: "https://owasp.org/www-project-juice-shop/" },
      { label: "Hosted Juice Shop", url: "https://juice-shop.herokuapp.com" },
      { label: "Alt. Hosted Instance", url: "https://demo.owasp-juice.shop" },
      { label: "PortSwigger SQLi", url: "https://portswigger.net/web-security/sql-injection" },
      { label: "PortSwigger XSS", url: "https://portswigger.net/web-security/cross-site-scripting" },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "SQL Injection — Admin Login",
        description: "Bypass admin authentication using SQL injection on the login form.",
        points: 20,
        flagTemplate: "NEXUS{SQLI_ADMIN_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "SQL Injection — Data Extraction",
        description:
          "Use UNION-based SQL injection through the search bar to enumerate user accounts.",
        points: 25,
        flagTemplate: "NEXUS{SQLI_UNION_${TEAM_ID}}",
      },
      {
        id: "ch-3",
        title: "Reflected XSS",
        description:
          "Inject JavaScript via the search parameter and trigger an alert in the browser.",
        points: 20,
        flagTemplate: "NEXUS{XSS_REFLECTED_${TEAM_ID}}",
      },
      {
        id: "ch-4",
        title: "Persistent XSS",
        description:
          "Submit a payload through customer feedback that persists in the application.",
        points: 20,
        flagTemplate: "NEXUS{XSS_STORED_${TEAM_ID}}",
      },
      {
        id: "ch-5",
        title: "Password Reset Logic Flaw",
        description:
          "Reset Jim's password by guessing the security question (Samuel) and log in.",
        points: 15,
        flagTemplate: "NEXUS{RESET_JIM_PASSWORD_${TEAM_ID}}",
      },
    ],
  },

  {
    id: "red-2-advanced-web",
    roomCode: "RED-2",
    session: 9,
    title: "Advanced Application Exploits",
    description:
      "Move beyond OWASP basics into file upload, SSRF, and IDOR class vulnerabilities.",
    team: "red",
    difficulty: "Intermediate",
    duration: "75 min",
    participants: 0,
    tags: ["Red Team", "Web", "SSRF", "IDOR"],
    prerequisites: ["Completion of RED-1", "Comfort with HTTP request tampering"],
    objectives: [
      "Upload malicious content past weak validation",
      "Trigger Server-Side Request Forgery to internal services",
      "Discover and exploit Insecure Direct Object References",
    ],
    externalResources: [
      { label: "PortSwigger SSRF", url: "https://portswigger.net/web-security/ssrf" },
      { label: "PortSwigger IDOR", url: "https://portswigger.net/web-security/access-control/idor" },
      {
        label: "PortSwigger File Upload",
        url: "https://portswigger.net/web-security/file-upload",
      },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "Unrestricted File Upload",
        description: "Upload a payload that bypasses weak client/server-side filters.",
        points: 30,
        flagTemplate: "NEXUS{FILE_UPLOAD_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "Server-Side Request Forgery",
        description: "Force the server to fetch a resource on the internal network.",
        points: 35,
        flagTemplate: "NEXUS{SSRF_${TEAM_ID}}",
      },
      {
        id: "ch-3",
        title: "IDOR — Horizontal Privilege",
        description: "Access another user's resource by manipulating object identifiers.",
        points: 35,
        flagTemplate: "NEXUS{IDOR_${TEAM_ID}}",
      },
    ],
  },

  {
    id: "red-3-cloud-attacks",
    roomCode: "RED-3",
    session: 11,
    title: "Cloud Attacks",
    description:
      "Recognize the most common cloud misconfigurations and how they convert to access.",
    team: "red",
    difficulty: "Intermediate",
    duration: "60 min",
    participants: 0,
    tags: ["Red Team", "Cloud", "GCP", "Misconfig"],
    prerequisites: [
      "Basic cloud terminology (IAM, buckets, service accounts)",
      "Comfortable reading JSON / YAML",
    ],
    objectives: [
      "Identify publicly readable storage and metadata leaks",
      "Reason about IAM scoping mistakes",
      "Document blast radius of a single leaked credential",
    ],
    externalResources: [
      { label: "GCP IAM Best Practices", url: "https://cloud.google.com/iam/docs/using-iam-securely" },
      { label: "OWASP Cloud Top 10", url: "https://owasp.org/www-project-cloud-native-application-security-top-10/" },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "Public Bucket Discovery",
        description: "Locate a publicly listable storage bucket in the lab environment.",
        points: 40,
        flagTemplate: "NEXUS{CLOUD_PUBLIC_BUCKET_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "IAM Misconfiguration",
        description: "Identify an over-scoped role that allows escalation to admin.",
        points: 60,
        flagTemplate: "NEXUS{CLOUD_IAM_MISCONFIG_${TEAM_ID}}",
      },
    ],
  },

  {
    id: "red-4-post-exploitation",
    roomCode: "RED-4",
    session: 9,
    title: "Post-Exploitation Foundations",
    description:
      "What attackers do once they get a foothold — privilege checks, persistence basics, and impact.",
    team: "red",
    difficulty: "Intermediate",
    duration: "60 min",
    participants: 0,
    tags: ["Red Team", "Post-Exploit", "Privesc"],
    prerequisites: ["Completion of RED-1"],
    objectives: [
      "Enumerate the system after gaining access",
      "Recognize common privilege-escalation vectors",
      "Reason about persistence and detection",
    ],
    externalResources: [
      { label: "GTFOBins", url: "https://gtfobins.github.io/" },
      { label: "MITRE ATT&CK", url: "https://attack.mitre.org/" },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "Local Enumeration",
        description: "Map running services, users, and writable paths on the lab box.",
        points: 30,
        flagTemplate: "NEXUS{POSTEX_ENUM_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "Privilege Escalation",
        description: "Use a known SUID misconfiguration to escalate to root.",
        points: 40,
        flagTemplate: "NEXUS{POSTEX_PRIVESC_${TEAM_ID}}",
      },
    ],
  },

  {
    id: "blue-1-host-hardening",
    roomCode: "BLUE-1",
    session: 6,
    title: "Host & Network Hardening",
    description:
      "Apply a baseline hardening checklist to a Linux lab VM and document the changes.",
    team: "blue",
    difficulty: "Beginner",
    duration: "60 min",
    participants: 0,
    tags: ["Blue Team", "Hardening", "Linux", "Firewall"],
    prerequisites: ["Basic Linux command line", "Understanding of services and ports"],
    objectives: [
      "Identify insecure default services",
      "Apply basic firewall ingress/egress controls",
      "Configure a defensible password / account policy",
      "Document and justify each hardening change",
    ],
    externalResources: [
      { label: "CIS Benchmarks", url: "https://www.cisecurity.org/cis-benchmarks/" },
      {
        label: "Ubuntu Server Hardening",
        url: "https://ubuntu.com/security/cves",
      },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "Firewall Active",
        description: "Enable a host firewall and confirm only required ports are open.",
        points: 30,
        flagTemplate: "NEXUS{HOST_FIREWALL_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "Service Reduction",
        description: "Disable at least three unnecessary services on the lab VM.",
        points: 35,
        flagTemplate: "NEXUS{SERVICES_HARDENED_${TEAM_ID}}",
      },
      {
        id: "ch-3",
        title: "Account Policy",
        description: "Apply a password complexity / lockout policy and verify enforcement.",
        points: 35,
        flagTemplate: "NEXUS{PASSWORD_POLICY_${TEAM_ID}}",
      },
    ],
  },

  {
    id: "blue-2-monitoring",
    roomCode: "BLUE-2",
    session: 8,
    title: "Monitoring & Packet Analysis",
    description:
      "Capture traffic during a demo attack and identify suspicious patterns and IOCs.",
    team: "blue",
    difficulty: "Intermediate",
    duration: "75 min",
    participants: 0,
    tags: ["Blue Team", "Network", "Wireshark", "IOC"],
    prerequisites: ["Basic TCP/IP", "Comfort with Wireshark filters"],
    objectives: [
      "Read a packet capture and identify protocol behavior",
      "Recognize a SYN flood and basic DoS patterns",
      "Spot suspicious HTTP payloads (e.g. sqli, web shell)",
    ],
    externalResources: [
      { label: "Wireshark Docs", url: "https://www.wireshark.org/docs/" },
      {
        label: "BTL Network Analysis – Ransomware",
        url: "https://blueteamlabs.online/home/challenge/network-analysis-ransomware-3dd520c7ec",
      },
      {
        label: "BTL Network Analysis – Web Shell",
        url: "https://blueteamlabs.online/home/challenge/network-analysis-web-shell-d4d3a2821b",
      },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "Identify SYN Flood",
        description: "Spot the SYN flood signature in the provided capture and quantify it.",
        points: 40,
        flagTemplate: "NEXUS{SYN_FLOOD_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "Suspicious HTTP Payload",
        description: "Locate the malicious HTTP request inside the capture and explain its intent.",
        points: 50,
        flagTemplate: "NEXUS{MAL_HTTP_${TEAM_ID}}",
      },
    ],
  },

  {
    id: "blue-3-ids-siem",
    roomCode: "BLUE-3",
    session: 10,
    title: "IDS/IPS & SIEM Fundamentals",
    description:
      "Author a basic Snort/Suricata signature and ingest sample logs into a lightweight SIEM.",
    team: "blue",
    difficulty: "Intermediate",
    duration: "75 min",
    participants: 0,
    tags: ["Blue Team", "SIEM", "IDS", "Snort"],
    prerequisites: ["BLUE-2 completion recommended", "Familiarity with regex"],
    objectives: [
      "Write a Snort/Suricata signature that matches a known IOC",
      "Ingest sample logs into a SIEM and tag them",
      "Author a simple correlation rule",
    ],
    externalResources: [
      { label: "Snort Rules", url: "https://www.snort.org/documents" },
      { label: "Suricata Docs", url: "https://suricata.io/documentation/" },
      { label: "Wazuh Quickstart", url: "https://documentation.wazuh.com/" },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "Author IDS Signature",
        description: "Write a Snort/Suricata signature that triggers on the lab IOC.",
        points: 50,
        flagTemplate: "NEXUS{IDS_SIGNATURE_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "SIEM Correlation",
        description: "Build a SIEM rule that correlates the IDS hit with an auth failure.",
        points: 50,
        flagTemplate: "NEXUS{SIEM_CORRELATION_${TEAM_ID}}",
      },
    ],
  },

  {
    id: "blue-4-incident-response",
    roomCode: "BLUE-4",
    session: 12,
    title: "Incident Response & Cloud Defense",
    description:
      "Walk a short IR playbook end-to-end and apply baseline cloud hardening on a bucket.",
    team: "blue",
    difficulty: "Advanced",
    duration: "90 min",
    participants: 0,
    tags: ["Blue Team", "IR", "GCP", "Playbook"],
    prerequisites: ["Awareness of the IR lifecycle (PICERL)"],
    objectives: [
      "Execute a short IR playbook on a simulated compromise",
      "Preserve evidence before remediation",
      "Apply secure-by-default configuration to a cloud bucket",
    ],
    externalResources: [
      {
        label: "NIST IR Lifecycle (SP 800-61)",
        url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final",
      },
      { label: "GCP Bucket Hardening", url: "https://cloud.google.com/storage/docs/access-control" },
    ],
    challenges: [
      {
        id: "ch-1",
        title: "IR Playbook Execution",
        description: "Walk the simulated compromise through containment and eradication.",
        points: 50,
        flagTemplate: "NEXUS{IR_PLAYBOOK_${TEAM_ID}}",
      },
      {
        id: "ch-2",
        title: "Cloud Bucket Hardening",
        description: "Lock down a public GCP bucket and verify with a probe.",
        points: 50,
        flagTemplate: "NEXUS{GCP_BUCKET_SECURED_${TEAM_ID}}",
      },
    ],
  },
];

// ─── Lookups ─────────────────────────────────────────────────────────────────

export const ROOM_BY_ID = new Map(ROOMS_CATALOG.map((room) => [room.id, room]));

export const ROOM_BY_CODE = new Map<RoomCode, CatalogRoom>(
  ROOMS_CATALOG.map((room) => [room.roomCode, room])
);

export interface ChallengeMetaEntry {
  team: Team;
  roomName: string;
  roomCode: RoomCode;
  points: number;
  flagTemplate: string;
}

export const CHALLENGE_META: Record<string, ChallengeMetaEntry> = Object.fromEntries(
  ROOMS_CATALOG.flatMap((room) =>
    room.challenges.map((challenge) => [
      `${room.id}:${challenge.id}`,
      {
        team: room.team,
        roomName: room.title,
        roomCode: room.roomCode,
        points: challenge.points,
        flagTemplate: challenge.flagTemplate,
      },
    ])
  )
);

export function solvedKey(roomId: string, challengeId: string): string {
  return `${roomId}:${challengeId}`;
}

export function getChallengeMetaEntry(
  roomId: string,
  challengeId: string
): ChallengeMetaEntry | null {
  return CHALLENGE_META[solvedKey(roomId, challengeId)] ?? null;
}

/**
 * `NEXUS{...}` envelope check: a flag must be uppercase letters, digits and
 * underscores between the braces. Used by the backend before template compare.
 */
export const NEXUS_FLAG_REGEX = /^NEXUS\{[A-Z0-9_]+\}$/;

/**
 * Substitutes a user's `teamId` into a stored `flagTemplate`.
 * Returns the canonical expected flag for that user/challenge.
 */
export function renderExpectedFlag(template: string, teamId: string): string {
  return template.replace(/\$\{TEAM_ID\}/g, teamId.toUpperCase());
}
