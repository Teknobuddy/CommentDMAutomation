export default function DataDeletion() {
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
      <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
        Data Deletion Instructions
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Last updated: June 24, 2026
      </p>

      <p>
        This page explains how you can request the deletion of any data
        collected by the Comment-to-DM Automation tool (&quot;the
        App&quot;).
      </p>

      <h2 style={sectionHeading}>What Data the App Stores</h2>
      <p>
        The App stores minimal operational data needed for it to function,
        including:
      </p>
      <ul>
        <li>
          Automation configuration (trigger keywords, reply text, DM text)
          set by the App owner
        </li>
        <li>
          Records used to track which comments have already received an
          automated reply or DM, in order to avoid sending duplicates
        </li>
      </ul>
      <p>
        These records may reference an Instagram-assigned user ID associated
        with a comment, but do not include private profile information,
        passwords, or payment details.
      </p>

      <h2 style={sectionHeading}>How to Request Deletion</h2>
      <p>
        If you have commented on a post or reel using this App and would
        like any associated data deleted, you can request this by emailing:
      </p>
      <p>
        <a href="mailto:hparikh.1699@gmail.com">hparikh.1699@gmail.com</a>
      </p>
      <p>
        Please include the Instagram username or comment in question so the
        request can be located and processed. Requests will be completed
        within 30 days of receipt.
      </p>

      <h2 style={sectionHeading}>Automatic Removal</h2>
      <p>
        Operational records used to prevent duplicate automated responses
        are not retained indefinitely and may be deleted or overwritten as
        part of normal operation of the App, independent of a specific
        request.
      </p>

      <h2 style={sectionHeading}>Contact</h2>
      <p>
        For any questions about this process, please contact:{" "}
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
