import RoomLab, { Bullets, InlineCode, PayloadBlock } from "./RoomLab";
import type { RoomBodyProps, RoomLessonMap } from "./types";

const JUICE_LOGIN = "https://juice-shop.herokuapp.com/#/login";
const JUICE_HOME = "https://juice-shop.herokuapp.com";
const JUICE_FEEDBACK = "https://juice-shop.herokuapp.com/#/contact";

const RED_1_LESSONS: RoomLessonMap = {
  "ch-1": {
    objective:
      "Use SQL injection to log in as the administrator without knowing the password.",
    background: (
      <p>
        SQL injection occurs when user input is concatenated directly into a SQL
        query. The vulnerable lookup roughly looks like:
        {" "}
        <InlineCode>
          SELECT * FROM Users WHERE email = '[INPUT]' AND password = '[HASH]'
        </InlineCode>
        . By closing the string and commenting out the rest, the password check
        is skipped.
      </p>
    ),
    steps: [
      {
        title: "Open the login page",
        body: (
          <Bullets
            items={[
              <>Click <strong>Account ? Login</strong> on Juice Shop.</>,
              <>The URL should be <InlineCode>/#/login</InlineCode>.</>,
              <>Open Developer Tools (F12) and watch the Network tab.</>,
            ]}
          />
        ),
      },
      {
        title: "Test a normal login",
        body: (
          <>
            <p>Try a benign credential pair to see how the app responds:</p>
            <PayloadBlock>{`Email:    test@test.com\nPassword: test123`}</PayloadBlock>
            <p>Expect <em>"Invalid email or password"</em>.</p>
          </>
        ),
      },
      {
        title: "Inject the SQL payload",
        body: (
          <>
            <p>
              In the <strong>Email</strong> field paste the payload below.
              Type any value into the password field.
            </p>
            <PayloadBlock>{`admin@juice-sh.op'--`}</PayloadBlock>
            <p>
              The <InlineCode>--</InlineCode> comments out the password check,
              and the broken quote terminates the email comparison early.
            </p>
          </>
        ),
      },
      {
        title: "Verify and capture",
        body: (
          <Bullets
            items={[
              <>You should be logged in as <InlineCode>admin@juice-sh.op</InlineCode>.</>,
              <>Open <strong>Account ? Score Board</strong> and confirm <em>Login Admin</em> is solved.</>,
              <>Submit your flag below in the form <InlineCode>{`NEXUS{SQLI_ADMIN_<TEAM_ID>}`}</InlineCode>.</>,
            ]}
          />
        ),
      },
    ],
    verification: [
      "Bypassed login without knowing a password",
      "Logged in as admin@juice-sh.op",
      "'Login Admin' challenge marked as Solved on the Score Board",
      "Flag accepted by the platform",
    ],
    resources: [{ label: "Open target", url: JUICE_LOGIN }],
  },

  "ch-2": {
    objective:
      "Use UNION-based SQL injection through the search bar to enumerate user accounts.",
    background: (
      <p>
        UNION-based injection appends rows from another <InlineCode>SELECT</InlineCode>{" "}
        onto the original result set. You first need to find the column count
        of the target query, then craft a UNION that returns columns from the
        users table.
      </p>
    ),
    steps: [
      {
        title: "Probe the search endpoint",
        body: (
          <>
            <p>
              On the home page enter a normal search like{" "}
              <InlineCode>apple</InlineCode> and observe the URL{" "}
              <InlineCode>/#/search?q=apple</InlineCode>. Then try:
            </p>
            <PayloadBlock>{`apple' OR 1=1--`}</PayloadBlock>
            <p>
              If the page suddenly shows every product, the parameter is
              concatenated into a query.
            </p>
          </>
        ),
      },
      {
        title: "Determine column count",
        body: (
          <>
            <p>
              Increment <InlineCode>NULL</InlineCode>s until the query returns
              without an error. Juice Shop uses 9 columns:
            </p>
            <PayloadBlock>{`' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL FROM Users--`}</PayloadBlock>
          </>
        ),
      },
      {
        title: "Extract emails &amp; password hashes",
        body: (
          <>
            <p>Place real columns into the visible positions:</p>
            <PayloadBlock>{`' UNION SELECT NULL, email, password, NULL, NULL, NULL, NULL, NULL, NULL FROM Users--`}</PayloadBlock>
            <p>
              The "fake products" rendered in the search results will surface
              email addresses and password hashes. Count how many unique users
              you see (typically 15–20).
            </p>
          </>
        ),
      },
      {
        title: "Capture the flag",
        body: (
          <p>
            Submit the flag <InlineCode>{`NEXUS{SQLI_UNION_<TEAM_ID>}`}</InlineCode>{" "}
            below.
          </p>
        ),
      },
    ],
    verification: [
      "Identified the correct column count (9)",
      "Extracted email addresses via UNION SELECT",
      "Counted the total number of users",
      "Score Board shows the user-extraction challenge as Solved",
    ],
    resources: [{ label: "Open target", url: JUICE_HOME }],
  },

  "ch-3": {
    objective:
      "Trigger reflected XSS by injecting JavaScript through the search parameter.",
    background: (
      <p>
        Reflected XSS happens when input is echoed back into the DOM without
        sanitisation. Confirming it with a benign alert proves arbitrary
        JavaScript can run in a victim's browser.
      </p>
    ),
    steps: [
      {
        title: "Try a basic payload",
        body: (
          <>
            <p>In the search bar enter:</p>
            <PayloadBlock>{`<iframe src="javascript:alert('XSS')">`}</PayloadBlock>
            <p>An alert pops up — JavaScript executed inside Juice Shop.</p>
          </>
        ),
      },
      {
        title: "Show the impact",
        body: (
          <>
            <p>Try one that prints the session cookie:</p>
            <PayloadBlock>{`<iframe src="javascript:alert(document.cookie)">`}</PayloadBlock>
            <p>
              In a real attack this value would be exfiltrated to an
              attacker-controlled server.
            </p>
          </>
        ),
      },
      {
        title: "Verify on the Score Board",
        body: (
          <Bullets
            items={[
              <>Open <strong>Account ? Score Board</strong>.</>,
              <>Look for the DOM XSS / Reflected XSS challenge being marked Solved.</>,
              <>Submit <InlineCode>{`NEXUS{XSS_REFLECTED_<TEAM_ID>}`}</InlineCode>.</>,
            ]}
          />
        ),
      },
    ],
    verification: [
      "JavaScript executed in the browser via the search field",
      "Demonstrated session-cookie disclosure with alert()",
      "DOM XSS / Reflected XSS challenge marked as Solved",
    ],
    resources: [{ label: "Open target", url: JUICE_HOME }],
  },

  "ch-4": {
    objective:
      "Submit an XSS payload through the customer feedback form so it persists in the application data.",
    background: (
      <p>
        Persistent (stored) XSS lives in the application's data store and runs
        whenever the affected page is rendered. It is more dangerous than
        reflected XSS because the attacker doesn't need to coerce victims into
        a malicious URL.
      </p>
    ),
    steps: [
      {
        title: "Open the feedback form",
        body: (
          <Bullets
            items={[
              <>Scroll to the bottom of the homepage and click <strong>Customer Feedback</strong>, or open <InlineCode>/#/contact</InlineCode>.</>,
              <>Solve the simple math CAPTCHA when prompted.</>,
            ]}
          />
        ),
      },
      {
        title: "Submit the payload",
        body: (
          <>
            <p>In the comment field enter:</p>
            <PayloadBlock>{`<iframe src="javascript:alert('Stored_XSS')">`}</PayloadBlock>
          </>
        ),
      },
      {
        title: "Confirm persistence",
        body: (
          <p>
            Logged-in admins can review feedback in the admin panel — your
            payload will execute there. The Score Board entry to look for is{" "}
            <em>API-only XSS</em> or similar. Then submit{" "}
            <InlineCode>{`NEXUS{XSS_STORED_<TEAM_ID>}`}</InlineCode>.
          </p>
        ),
      },
    ],
    verification: [
      "Stored XSS payload accepted by the feedback form",
      "Payload survives a page reload",
      "Stored XSS challenge marked as Solved",
    ],
    resources: [{ label: "Open target", url: JUICE_FEEDBACK }],
  },

  "ch-5": {
    objective:
      "Reset Jim's password by guessing his security question and log in as him.",
    background: (
      <p>
        Authentication weaknesses don't always require SQL injection. A weak
        password-reset flow that relies on a guessable security question can
        give attackers full account takeover.
      </p>
    ),
    steps: [
      {
        title: "Start the reset",
        body: (
          <Bullets
            items={[
              <>Open <strong>Login ? Forgot your password?</strong></>,
              <>Enter <InlineCode>jim@juice-sh.op</InlineCode>.</>,
            ]}
          />
        ),
      },
      {
        title: "Answer the security question",
        body: (
          <p>
            Jim's "eldest sibling's middle name" is{" "}
            <InlineCode>Samuel</InlineCode> — the official Juice Shop OSINT
            answer. Use it to authorise the reset.
          </p>
        ),
      },
      {
        title: "Set a new password and log in",
        body: (
          <Bullets
            items={[
              <>Set a new password (e.g. <InlineCode>newpassword123</InlineCode>).</>,
              <>Log in as <InlineCode>jim@juice-sh.op</InlineCode>.</>,
              <>Confirm <em>Reset Jim's Password</em> on the Score Board.</>,
              <>Submit <InlineCode>{`NEXUS{RESET_JIM_PASSWORD_<TEAM_ID>}`}</InlineCode>.</>,
            ]}
          />
        ),
      },
    ],
    verification: [
      "Reset Jim's password using the correct security answer",
      "Logged in as jim@juice-sh.op",
      "'Reset Jim's Password' challenge marked Solved",
    ],
    resources: [{ label: "Open target", url: JUICE_LOGIN }],
  },
};

export default function Red1Body(props: RoomBodyProps) {
  return <RoomLab {...props} lessons={RED_1_LESSONS} />;
}
