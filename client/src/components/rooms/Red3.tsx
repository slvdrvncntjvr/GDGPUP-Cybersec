import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const RED_3_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Locate a publicly readable storage bucket and confirm its contents.",
    background: (
      <p>
        Storage buckets default to private on most clouds, but a single bad
        IAM toggle (e.g. <InlineCode>allUsers</InlineCode> on GCS or{" "}
        <InlineCode>public-read</InlineCode> on S3) leaks the entire bucket to
        the internet.
      </p>
    ),
    steps: [
      {
        title: "Enumerate plausible names",
        body: (
          <p>
            Build a small list of probable bucket names (organisation slug,
            project name, env). Try them with the public listing endpoint:
          </p>
        ),
      },
      {
        title: "List the bucket",
        body: (
          <PayloadBlock>{`curl -s https://storage.googleapis.com/<bucket>?prefix=&max-keys=20`}</PayloadBlock>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{CLOUD_PUBLIC_BUCKET_<TEAM_ID>}`}</InlineCode>{" "}
            once you've demonstrated a successful unauthenticated listing.
          </p>
        ),
      },
    ],
    verification: [
      "Listed a public bucket without credentials",
      "Identified at least one sensitive object inside",
      "Documented the IAM mistake that caused the leak",
    ],
  },
  "ch-2": {
    objective:
      "Identify an over-scoped IAM role that allows escalation to admin.",
    background: (
      <p>
        IAM misconfiguration is the cloud equivalent of a privilege-escalation
        primitive. Common causes include attaching <InlineCode>roles/owner</InlineCode>{" "}
        to a service account or granting{" "}
        <InlineCode>iam.serviceAccountTokenCreator</InlineCode> to a low-trust
        principal.
      </p>
    ),
    steps: [
      {
        title: "Pull the IAM bindings",
        body: (
          <PayloadBlock>{`gcloud projects get-iam-policy <project> --format=json`}</PayloadBlock>
        ),
      },
      {
        title: "Identify the dangerous binding",
        body: (
          <Bullets
            items={[
              <>Look for <InlineCode>allUsers</InlineCode> / <InlineCode>allAuthenticatedUsers</InlineCode> with non-trivial roles.</>,
              <>Look for <InlineCode>roles/owner</InlineCode> on service accounts that don't need it.</>,
            ]}
          />
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{CLOUD_IAM_MISCONFIG_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Identified the over-scoped binding",
      "Reasoned through what an attacker could do with it",
      "Recommended a least-privilege fix",
    ],
  },
};

export default function Red3Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={RED_3_LESSONS} />;
}
