import type { Team } from "./schema";

export interface CatalogChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
}

export interface CatalogRoom {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  participants: number;
  tags: string[];
  team: Team;
  objectives?: string[];
  prerequisites?: string[];
  challenges: CatalogChallenge[];
}

export const ROOMS_CATALOG: CatalogRoom[] = [
  {
    id: "siem-triage",
    title: "SIEM Alert Triage",
    description: "Investigate suspicious logins and lateral movement using a SIEM dashboard.",
    difficulty: "Beginner",
    duration: "45 min",
    participants: 1234,
    tags: ["Blue Team", "SIEM", "Log Analysis"],
    team: "blue",
    objectives: ["Understand SIEM alert structure", "Correlate events across logs", "Prioritize incidents"],
    challenges: [
      { id: "ch-1", title: "Alert Classification", description: "Learn to classify alerts", points: 50 },
      { id: "ch-2", title: "Log Correlation", description: "Connect multiple log sources", points: 100 },
      { id: "ch-3", title: "Lateral Movement", description: "Detect attacker movement", points: 150 },
    ],
  },
  {
    id: "windows-hunt",
    title: "Windows Event Hunt",
    description: "Pivot through Security, Sysmon, and PowerShell logs to detect malicious behavior.",
    difficulty: "Intermediate",
    duration: "60 min",
    participants: 892,
    tags: ["Blue Team", "Windows", "Threat Hunting"],
    team: "blue",
    objectives: ["Navigate Windows Event logs", "Use Sysmon for detection", "Identify PowerShell attacks"],
    challenges: [
      { id: "ch-1", title: "Event ID Basics", description: "Learn critical event IDs", points: 75 },
      { id: "ch-2", title: "Sysmon Analysis", description: "Process creation tracking", points: 125 },
    ],
  },
  {
    id: "firewall-hardening",
    title: "Firewall Hardening",
    description: "Analyze traffic and apply rules to block brute-force and command & control.",
    difficulty: "Beginner",
    duration: "30 min",
    participants: 756,
    tags: ["Blue Team", "Network", "Hardening"],
    team: "blue",
    challenges: [
      { id: "ch-1", title: "Rule Basics", description: "Create firewall rules", points: 50 },
      { id: "ch-2", title: "Block C2", description: "Identify and block C2 traffic", points: 100 },
    ],
  },
  {
    id: "incident-response",
    title: "Incident Response Drill",
    description: "Contain, eradicate, and recover in a simulated enterprise compromise.",
    difficulty: "Advanced",
    duration: "120 min",
    participants: 445,
    tags: ["Blue Team", "IR", "Playbooks"],
    team: "blue",
    challenges: [
      { id: "ch-1", title: "Detection", description: "Identify the compromise", points: 100 },
      { id: "ch-2", title: "Containment", description: "Isolate affected systems", points: 150 },
      { id: "ch-3", title: "Eradication", description: "Remove the threat", points: 150 },
      { id: "ch-4", title: "Recovery", description: "Restore operations", points: 100 },
    ],
  },
  {
    id: "memory-forensics",
    title: "Memory Forensics",
    description: "Analyze memory dumps to uncover hidden malware and attacker artifacts.",
    difficulty: "Advanced",
    duration: "90 min",
    participants: 312,
    tags: ["Blue Team", "Forensics", "Malware"],
    team: "blue",
    challenges: [
      { id: "ch-1", title: "Process Analysis", description: "Find suspicious processes", points: 125 },
      { id: "ch-2", title: "Injection Detection", description: "Identify code injection", points: 175 },
    ],
  },
  {
    id: "web-sqli",
    title: "Web Exploitation: SQLi",
    description: "Identify injection points, exfiltrate data, and craft safe payloads.",
    difficulty: "Intermediate",
    duration: "60 min",
    participants: 1567,
    tags: ["Red Team", "Web", "SQLi"],
    team: "red",
    objectives: ["Find injection vulnerabilities", "Bypass filters", "Extract database contents"],
    challenges: [
      { id: "ch-1", title: "Basic SQLi", description: "Simple injection techniques", points: 75 },
      { id: "ch-2", title: "Blind SQLi", description: "Boolean and time-based attacks", points: 150 },
    ],
  },
  {
    id: "linux-privesc",
    title: "Linux Privilege Escalation",
    description: "Enumerate misconfigs, exploit SUID binaries, and escalate to root.",
    difficulty: "Intermediate",
    duration: "90 min",
    participants: 1123,
    tags: ["Red Team", "Linux", "Privesc"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Enumeration", description: "Find privilege escalation vectors", points: 75 },
      { id: "ch-2", title: "SUID Exploitation", description: "Abuse SUID binaries", points: 125 },
      { id: "ch-3", title: "Root Access", description: "Gain root privileges", points: 150 },
    ],
  },
  {
    id: "osint-recon",
    title: "OSINT Recon Challenge",
    description: "Gather intel from public sources to map targets and discover exposures.",
    difficulty: "Beginner",
    duration: "45 min",
    participants: 678,
    tags: ["Red Team", "OSINT", "Recon"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Domain Intel", description: "Enumerate subdomains and IPs", points: 50 },
      { id: "ch-2", title: "Employee OSINT", description: "Find employee information", points: 75 },
    ],
  },
  {
    id: "ad-attack",
    title: "AD Attack Path",
    description: "Abuse weak ACLs to move laterally and dump credentials in a lab AD.",
    difficulty: "Advanced",
    duration: "120 min",
    participants: 334,
    tags: ["Red Team", "Windows", "Active Directory"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Bloodhound Mapping", description: "Map AD attack paths", points: 100 },
      { id: "ch-2", title: "Kerberoasting", description: "Extract service tickets", points: 150 },
      { id: "ch-3", title: "DCSync", description: "Dump domain credentials", points: 200 },
    ],
  },
  {
    id: "xss-exploitation",
    title: "XSS Exploitation",
    description: "Find and exploit cross-site scripting vulnerabilities in web applications.",
    difficulty: "Beginner",
    duration: "45 min",
    participants: 945,
    tags: ["Red Team", "Web", "XSS"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Reflected XSS", description: "Simple reflection attacks", points: 50 },
      { id: "ch-2", title: "Stored XSS", description: "Persistent script injection", points: 100 },
    ],
  },
  {
    id: "api-exploitation",
    title: "API Security Testing",
    description: "Test REST APIs for authentication flaws, IDOR, and mass assignment.",
    difficulty: "Intermediate",
    duration: "75 min",
    participants: 567,
    tags: ["Red Team", "API", "Web"],
    team: "red",
    challenges: [
      { id: "ch-1", title: "Auth Bypass", description: "Find authentication weaknesses", points: 100 },
      { id: "ch-2", title: "IDOR Discovery", description: "Access unauthorized resources", points: 125 },
    ],
  },
  {
    id: "log-analysis",
    title: "Log Analysis Fundamentals",
    description: "Learn to parse, analyze, and correlate logs from various sources.",
    difficulty: "Beginner",
    duration: "40 min",
    participants: 1456,
    tags: ["Blue Team", "Logs", "Analysis"],
    team: "blue",
    challenges: [
      { id: "ch-1", title: "Log Parsing", description: "Extract key fields from logs", points: 40 },
      { id: "ch-2", title: "Pattern Recognition", description: "Identify anomalies", points: 60 },
    ],
  },
];

export const ROOM_BY_ID = new Map(ROOMS_CATALOG.map((room) => [room.id, room]));

export const CHALLENGE_META = Object.fromEntries(
  ROOMS_CATALOG.flatMap((room) =>
    room.challenges.map((challenge) => [
      `${room.id}:${challenge.id}`,
      { team: room.team, roomName: room.title },
    ])
  )
) as Record<string, { team: Team; roomName: string }>;

export function solvedKey(roomId: string, challengeId: string): string {
  return `${roomId}:${challengeId}`;
}
