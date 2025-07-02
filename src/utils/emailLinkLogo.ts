export function generateSignupLinkAndLogoHtml({
    frontendBaseUrl,
    logoUrl
}: {
    frontendBaseUrl: string;
    logoUrl: string;
}) {
    const timestamp = Date.now().toString();
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const customLink = `PO-36851–UPTIVE-MFG-${timestamp}_${randomId}`;
    const signupUrl = `${frontendBaseUrl}/signup/${customLink}`;

    const html = `
    <p>Click the logo below to sign up:</p>
    <a href="${signupUrl}">
      <img src="${logoUrl}" alt="Signup" style="width:120px;"/>
    </a>
    <p>Or copy and paste this link into your browser:<br>${signupUrl}</p>
  `;

    return { signupUrl, html };
} 