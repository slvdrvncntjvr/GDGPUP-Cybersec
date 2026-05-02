import { createHash } from "crypto";

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

// ─── Challenge Flag Registry ──────────────────────────────────────────────────
//
// Map key   : "roomId:challengeId"  (e.g. "siem-triage:ch-1")
// Map value : SHA-256 hash of the expected plaintext flag
//
// INSTRUCTOR NOTE — Plaintext flags (keep confidential, never expose to client):
//
//   siem-triage:ch-1         → FLAG{ALERT_CLASSIFIED_HIGH_PRIORITY}
//   siem-triage:ch-2         → FLAG{CORRELATED_EVENTS_REVEAL_PATTERN}
//   siem-triage:ch-3         → FLAG{LATERAL_MOVEMENT_DETECTED}
//
//   windows-hunt:ch-1        → FLAG{EVENT_ID_4624_LOGON_SUCCESS}
//   windows-hunt:ch-2        → FLAG{SYSMON_PROCESS_CREATE_DETECTED}
//
//   firewall-hardening:ch-1  → FLAG{RULE_DENY_INBOUND_22}
//   firewall-hardening:ch-2  → FLAG{C2_TRAFFIC_BLOCKED_ON_4444}
//
//   incident-response:ch-1   → FLAG{BREACH_DETECTED_STAGE_ONE}
//   incident-response:ch-2   → FLAG{CONTAINMENT_ZONE_ALPHA}
//   incident-response:ch-3   → FLAG{MALWARE_ERADICATED}
//   incident-response:ch-4   → FLAG{SYSTEMS_RESTORED}
//
//   memory-forensics:ch-1    → FLAG{SUSPICIOUS_PID_1337_FOUND}
//   memory-forensics:ch-2    → FLAG{PROCESS_INJECTION_HOLLOWING}
//
//   web-sqli:ch-1            → FLAG{SINGLE_QUOTE_BREAKS_QUERY}
//   web-sqli:ch-2            → FLAG{BOOLEAN_BASED_BLIND_SQLI}
//
//   linux-privesc:ch-1       → FLAG{SUDO_L_REVEALS_GTFOBINS}
//   linux-privesc:ch-2       → FLAG{SUID_BIT_SET_ON_BASH}
//   linux-privesc:ch-3       → FLAG{ROOT_HASH_FROM_SHADOW}
//
//   osint-recon:ch-1         → FLAG{SUBDOMAIN_FOUND_ADMIN_DEV}
//   osint-recon:ch-2         → FLAG{LINKEDIN_EMPLOYEE_OSINT}
//
//   ad-attack:ch-1           → FLAG{BLOODHOUND_PATH_TO_DA}
//   ad-attack:ch-2           → FLAG{KERBEROAST_SVC_ACCOUNT}
//   ad-attack:ch-3           → FLAG{DCSYNC_NTLM_HASH_DUMP}
//
//   xss-exploitation:ch-1    → FLAG{REFLECTED_XSS_ALERT_1}
//   xss-exploitation:ch-2    → FLAG{STORED_XSS_COOKIE_STOLEN}
//
//   api-exploitation:ch-1    → FLAG{JWT_NONE_ALG_BYPASS}
//   api-exploitation:ch-2    → FLAG{IDOR_USER_2_ACCESSED}
//
//   log-analysis:ch-1        → FLAG{REGEX_PARSED_APACHE_LOG}
//   log-analysis:ch-2        → FLAG{ANOMALY_3AM_LOGIN_DETECTED}

export const CHALLENGE_FLAGS: Record<string, string> = {
  // Blue Team — SIEM Alert Triage
  "siem-triage:ch-1": sha256("FLAG{ALERT_CLASSIFIED_HIGH_PRIORITY}"),
  "siem-triage:ch-2": sha256("FLAG{CORRELATED_EVENTS_REVEAL_PATTERN}"),
  "siem-triage:ch-3": sha256("FLAG{LATERAL_MOVEMENT_DETECTED}"),

  // Blue Team — Windows Event Hunt
  "windows-hunt:ch-1": sha256("FLAG{EVENT_ID_4624_LOGON_SUCCESS}"),
  "windows-hunt:ch-2": sha256("FLAG{SYSMON_PROCESS_CREATE_DETECTED}"),

  // Blue Team — Firewall Hardening
  "firewall-hardening:ch-1": sha256("FLAG{RULE_DENY_INBOUND_22}"),
  "firewall-hardening:ch-2": sha256("FLAG{C2_TRAFFIC_BLOCKED_ON_4444}"),

  // Blue Team — Incident Response Drill
  "incident-response:ch-1": sha256("FLAG{BREACH_DETECTED_STAGE_ONE}"),
  "incident-response:ch-2": sha256("FLAG{CONTAINMENT_ZONE_ALPHA}"),
  "incident-response:ch-3": sha256("FLAG{MALWARE_ERADICATED}"),
  "incident-response:ch-4": sha256("FLAG{SYSTEMS_RESTORED}"),

  // Blue Team — Memory Forensics
  "memory-forensics:ch-1": sha256("FLAG{SUSPICIOUS_PID_1337_FOUND}"),
  "memory-forensics:ch-2": sha256("FLAG{PROCESS_INJECTION_HOLLOWING}"),

  // Red Team — Web Exploitation: SQLi
  "web-sqli:ch-1": sha256("FLAG{SINGLE_QUOTE_BREAKS_QUERY}"),
  "web-sqli:ch-2": sha256("FLAG{BOOLEAN_BASED_BLIND_SQLI}"),

  // Red Team — Linux Privilege Escalation
  "linux-privesc:ch-1": sha256("FLAG{SUDO_L_REVEALS_GTFOBINS}"),
  "linux-privesc:ch-2": sha256("FLAG{SUID_BIT_SET_ON_BASH}"),
  "linux-privesc:ch-3": sha256("FLAG{ROOT_HASH_FROM_SHADOW}"),

  // Red Team — OSINT Recon Challenge
  "osint-recon:ch-1": sha256("FLAG{SUBDOMAIN_FOUND_ADMIN_DEV}"),
  "osint-recon:ch-2": sha256("FLAG{LINKEDIN_EMPLOYEE_OSINT}"),

  // Red Team — AD Attack Path
  "ad-attack:ch-1": sha256("FLAG{BLOODHOUND_PATH_TO_DA}"),
  "ad-attack:ch-2": sha256("FLAG{KERBEROAST_SVC_ACCOUNT}"),
  "ad-attack:ch-3": sha256("FLAG{DCSYNC_NTLM_HASH_DUMP}"),

  // Red Team — XSS Exploitation
  "xss-exploitation:ch-1": sha256("FLAG{REFLECTED_XSS_ALERT_1}"),
  "xss-exploitation:ch-2": sha256("FLAG{STORED_XSS_COOKIE_STOLEN}"),

  // Red Team — API Security Testing
  "api-exploitation:ch-1": sha256("FLAG{JWT_NONE_ALG_BYPASS}"),
  "api-exploitation:ch-2": sha256("FLAG{IDOR_USER_2_ACCESSED}"),

  // Blue Team — Log Analysis Fundamentals
  "log-analysis:ch-1": sha256("FLAG{REGEX_PARSED_APACHE_LOG}"),
  "log-analysis:ch-2": sha256("FLAG{ANOMALY_3AM_LOGIN_DETECTED}"),
};

/**
 * Returns true only if `submittedFlag` (trimmed) hashes to the known value for
 * the given room/challenge pair. Unknown pairs always return false.
 */
export function verifyFlag(
  roomId: string,
  challengeId: string,
  submittedFlag: string
): boolean {
  const key = `${roomId}:${challengeId}`;
  const expected = CHALLENGE_FLAGS[key];
  if (!expected) return false;
  return sha256(submittedFlag.trim()) === expected;
}
