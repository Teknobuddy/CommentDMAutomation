export default function PrivacyPolicy() {
  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "48px 24px 80px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#1a1a1a",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Privacy Policy</h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Last updated: June 24, 2026
      </p>

      <p>
        This Privacy Policy describes how the Comment-to-DM Automation tool
        (&quot;the App&quot;) collects, uses, and protects information when
        you interact with the Instagram account it operates on.
      </p>

      <h2 style={sectionHeading}>What the App Does</h2>
      <p>
        The App monitors comments on specific Instagram posts and reels for a
        configured trigger keyword. When a comment containing that keyword is
        detected, the App automatically:
      </p>
      <ul>
        <li>Replies publicly to the comment, and</li>
        <li>Sends a direct message (DM) to the commenter.</li>
      </ul>

      <h2 style={sectionHeading}>Information We Access</h2>
      <p>To provide this functionality, the App accesses:</p>
      <ul>
        <li>The text content of public comments on connected posts/reels</li>
        <li>
          The Instagram-assigned user ID of the person who left the comment
          (required by Instagram&apos;s API to send a reply or DM)
        </li>
        <li>
          Basic public post/reel metadata (such as media ID) needed to
          identify which post a comment belongs to
        </li>
      </ul>
      <p>
        The App does <strong>not</strong> access private profile information,
        passwords, payment details, or any data beyond what Instagram&apos;s
        official API provides for this purpose.
      </p>

      <h2 style={sectionHeading}>How Information Is Used</h2>
      <p>
        Information accessed by the App is used solely to determine whether a
        comment matches a configured trigger keyword, and if so, to send the
        configured automated reply and direct message. No information
        collected by the App is sold, rented, or shared with third parties
        for advertising or marketing purposes.
      </p>

      <h2 style={sectionHeading}>Data Storage</h2>
      <p>
        The App stores only the configuration you set (trigger keywords,
        reply text, DM text) and minimal operational data needed to avoid
        sending duplicate replies to the same comment. This data is stored
        securely on the App&apos;s hosting infrastructure and is not made
        publicly accessible.
      </p>

      <h2 style={sectionHeading}>Data Retention</h2>
      <p>
        Operational records used to prevent duplicate automated responses are
        retained only as long as necessary for the App to function correctly,
        and may be deleted or overwritten as part of normal operation.
      </p>

      <h2 style={sectionHeading}>Third-Party Services</h2>
      <p>
        The App communicates exclusively with Instagram&apos;s official
        Graph API to send replies and messages. No other third-party
        analytics, advertising, or data-broker services receive data
        collected through this App.
      </p>

      <h2 style={sectionHeading}>Your Choices</h2>
      <p>
        Because the App only operates on comments made on the connected
        Instagram account&apos;s own posts, anyone who does not wish to
        receive an automated reply or DM can simply avoid commenting with the
        configured trigger keyword. Commenters may also block or restrict the
        account at any time through Instagram&apos;s own settings.
      </p>

      <h2 style={sectionHeading}>Changes to This Policy</h2>
      <p>
        This Privacy Policy may be updated from time to time. Any changes
        will be reflected on this page with an updated &quot;Last
        updated&quot; date above.
      </p>

      <h2 style={sectionHeading}>Contact</h2>
      <p>
        If you have any questions about this Privacy Policy or how the App
        handles information, please contact:{" "}
        <a href="mailto:hparikh.1699@gmail.com">hparikh.1699@gmail.com</a>
      </p>
    </div>
  );
}

const sectionHeading: React.CSSProperties = {
  fontSize: "20px",
  marginTop: "32px",
  marginBottom: "8px",
};
