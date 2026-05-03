import { createHash } from "crypto";
import type { Team } from "@shared/schema";
import { CHALLENGE_META } from "@shared/challengeCatalog";

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export interface ChallengeMeta {
  team: Team;
  roomName: string;
}

export const CHALLENGE_FLAGS: Record<string, string> = {
  "siem-triage:ch-1": "8718c93bb92eb644bd34091dd9b8e5368ddf4a1e63d47ba2ec9344789edfcc8c",
  "siem-triage:ch-2": "14644b778f45e978ad51ef9eb0080047964a1832b6514c0a6a6a67ab1dde07a0",
  "siem-triage:ch-3": "0fd34774de9c5df9f2adfca8b58f93f5e04393d9f85e8546299899d76dadb781",
  "windows-hunt:ch-1": "62667f047f2d1087a2fb799a2eac7d619a4584fcb198d6c07de73bacfc9b8bf6",
  "windows-hunt:ch-2": "7cd5a5881ffbbbdf76369150ff513665e217a30ef919b1ec5a8fcca4287ff75f",
  "firewall-hardening:ch-1": "8695239389376d2de5acaae73ea5d04cbb342fc4a4096e7120f20bea1ec78686",
  "firewall-hardening:ch-2": "cc1d700565dac6e168c0dce891a92e2dced5faf1cb4515d5f84524cd9241bcb3",
  "incident-response:ch-1": "116db4b4f77c8adda5188bd0cfb1e3fd951f769b9c708453acda402a2b2910a4",
  "incident-response:ch-2": "e0f64e65fd642ddbd8e94c14416929ec19b76fd038753e48a170189f3690c6a0",
  "incident-response:ch-3": "837d3022b46225826b3ec6a6bfc0b1555b9d4378ecb9ee3eeeeab95ac096848a",
  "incident-response:ch-4": "ffde9bee355f2b7d2eb642c1076a0209cdaa6ce9e1e2b3a0169c570eb2bf7fa0",
  "memory-forensics:ch-1": "4c30d861aa7d88c84a56539410465cfa9f9a3b230e7d4fe1f2ab433f0cdba52d",
  "memory-forensics:ch-2": "25e1cfd6083f00cce6fc347a8cbc4611d041150abaceb6a41f6167ce51989395",
  "web-sqli:ch-1": "e2a58ddf23963f1f4a2d96cc3f0eccdf91f7a7b94088a6b80a073b1b4d31b01a",
  "web-sqli:ch-2": "4313bb57cfb8b46c9cab3d6cbd55b19ca0b98cdc052c28d865151866c8815f60",
  "linux-privesc:ch-1": "e7bdf73798e5113d49de4b1e1741b84066f01340b7f97cf6e077e37fde883ffd",
  "linux-privesc:ch-2": "ed3d05b3dfdaf774d750fc1292a367426a1721d992cc2c82400091730542c365",
  "linux-privesc:ch-3": "4d78396f52d676686d0bb1d22449331c0edfc9a679cc472dc6f75ede0c0cf358",
  "osint-recon:ch-1": "0ef540b419caff03d1e90df5faf69fac92d9ca3b5ef7541312d1710fb5712f91",
  "osint-recon:ch-2": "44014cf034d8d7f63de9a35905b451d73114ebccff4c65d4360249373451f0a4",
  "ad-attack:ch-1": "13e589c617af1e8f1c173c85b4f5eb6a36ddabd74e6dfc706cfd87988bd3e958",
  "ad-attack:ch-2": "d75b00ab9c9f53fcffdc9c07b5661c650346648b9da9e78e94602cbc4c2ff0ab",
  "ad-attack:ch-3": "268d1a449546c1dcf60dc3e4dd7b22772aa41e9ccdca32284336de77d7d36b95",
  "xss-exploitation:ch-1": "9104f7696bd5c963c19f5afa11296a05a4e8469c6df9218f0d46fe81cd2c1f05",
  "xss-exploitation:ch-2": "4a21792bd532a52a682a58af5b176f1fc83459dfff502e7f05b30ea275a76718",
  "api-exploitation:ch-1": "0c8753214d2cff08caaa677f0b576670cb9ec778674860934416007a269e7463",
  "api-exploitation:ch-2": "a6d797b829b630b3fdbe32914ba7629aac5c658bc079d41ee6e41abfd873e061",
  "log-analysis:ch-1": "96a0ac5efad912bfa5ae6443b13f8370362c5ba07762885b4861b8ed4b7014bb",
  "log-analysis:ch-2": "53903e728993bc3fa1efee1b7606c751076e6cb7e28d1199ef2d075a2453a0f2",
};

export function getChallengeMeta(roomId: string, challengeId: string): ChallengeMeta | null {
  return CHALLENGE_META[`${roomId}:${challengeId}`] ?? null;
}

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
