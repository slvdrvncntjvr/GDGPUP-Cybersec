import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const RED_2_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Bypass file-upload validation to land an executable payload on the server.",
    background: (
      <p>
        File-upload bugs come in three flavours: client-side checks only,
        weak content-type validation, and trust in the file extension. The fix
        is server-side magic-byte validation plus rendering uploads with a
        non-executing content type.
      </p>
    ),
    steps: [
      {
        title: "Map the upload form",
        body: (
          <p>
            Inspect the upload request in DevTools. Note the validations the
            client applies (e.g. <InlineCode>accept=&quot;.png,.jpg&quot;</InlineCode>) and
            which header(s) the server inspects.
          </p>
        ),
      },
      {
        title: "Bypass the filter",
        body: (
          <>
            <p>Try renaming an executable payload:</p>
            <PayloadBlock>{`payload.php.png\nContent-Type: image/png`}</PayloadBlock>
            <p>
              If the server stores the file under its original name and serves
              it back, request the path directly to confirm execution.
            </p>
          </>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{FILE_UPLOAD_<TEAM_ID>}`}</InlineCode> once you've
            demonstrated arbitrary file storage.
          </p>
        ),
      },
    ],
    verification: [
      "Identified the validation that was bypassed",
      "Successfully stored a non-image file via the upload form",
      "Documented remediation (server-side magic bytes + sanitised filename)",
    ],
  },
  "ch-2": {
    objective:
      "Coerce the server into making an HTTP request to an internal-only resource.",
    background: (
      <p>
        SSRF abuses a feature: code that fetches a URL on behalf of the user.
        On cloud platforms the most common target is the metadata service{" "}
        <InlineCode>169.254.169.254</InlineCode>; on internal networks it is
        admin panels reachable only to the server.
      </p>
    ),
    steps: [
      {
        title: "Find a URL fetcher",
        body: (
          <Bullets
            items={[
              <>Look for "import from URL", webhook, or avatar-from-URL features.</>,
              <>Trigger one using a benign URL you control to confirm fetch behaviour.</>,
            ]}
          />
        ),
      },
      {
        title: "Pivot inwards",
        body: (
          <>
            <p>Swap the target for an internal address:</p>
            <PayloadBlock>{`http://127.0.0.1:8080/admin\nhttp://169.254.169.254/latest/meta-data/`}</PayloadBlock>
            <p>
              Document the response and reason about what data is exposed.
            </p>
          </>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit <InlineCode>{`NEXUS{SSRF_<TEAM_ID>}`}</InlineCode> once internal
            access is demonstrated.
          </p>
        ),
      },
    ],
    verification: [
      "Identified the URL-fetching feature",
      "Reached an internal address through the server",
      "Documented blast radius for the bug",
    ],
  },
  "ch-3": {
    objective:
      "Find an Insecure Direct Object Reference and access another user's resource.",
    background: (
      <p>
        IDOR happens when authorisation isn't checked per object. If a request
        like <InlineCode>GET /api/orders/42</InlineCode> returns the order
        regardless of who owns it, you have IDOR.
      </p>
    ),
    steps: [
      {
        title: "Inventory references",
        body: (
          <p>
            Browse the app and note every numeric/UUID reference in URLs and
            response bodies. Pay special attention to user-scoped resources
            (orders, profile pages, attachments).
          </p>
        ),
      },
      {
        title: "Tamper with the reference",
        body: (
          <>
            <p>
              Replace your own object id with another value. Watch for{" "}
              <InlineCode>200</InlineCode> responses where you'd expect{" "}
              <InlineCode>403</InlineCode>.
            </p>
            <PayloadBlock>{`GET /api/v1/orders/41\nGET /api/v1/orders/42\nGET /api/v1/orders/43`}</PayloadBlock>
          </>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Once you've demonstrated cross-tenant data access, submit{" "}
            <InlineCode>{`NEXUS{IDOR_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Identified an unauthenticated/cross-user object reference",
      "Retrieved another user's data without their session",
      "Documented the missing authorisation check",
    ],
  },
};

export default function Red2Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={RED_2_LESSONS} />;
}
