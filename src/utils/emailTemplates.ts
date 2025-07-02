export function generateEmailTemplate({
    senderName,
    senderTitle,
    senderDepartment,
    companyName,
    senderEmail,
    message,
    subject,
    date,
    disclaimer,
    address,
    fax,
    contactEmail,
    copyright
}: {
    senderName: string;
    senderTitle: string;
    senderDepartment: string;
    companyName: string;
    senderEmail: string;
    message: string;
    subject: string;
    date: string;
    disclaimer: string;
    address: string;
    fax: string;
    contactEmail: string;
    copyright: string;
}) {
    return `
  <div style="font-family: Arial, sans-serif; color: #222;">
    <div style="margin-bottom: 16px;">
      <div style="font-weight: bold; font-size: 1.1em;">${senderName}</div>
      <div style="color: #888;">${senderEmail}</div>
      <div style="float: right; color: #888; font-size: 0.95em;">Date: ${date}</div>
    </div>
    <div style="margin-bottom: 8px;">
      <strong>Subject:</strong> ${subject}
    </div>
    <div style="margin: 24px 0 16px 0;">
      ${message}
    </div>
    <div style="margin: 24px 0 16px 0;">
      <a href="mailto:${senderEmail}" style="color: #1976d2; text-decoration: none; font-weight: bold;">${senderName}</a><br>
      <span style="font-weight: bold;">${senderTitle}</span><br>
      <span style="font-weight: bold;">${senderDepartment}</span><br>
      <span style="font-weight: bold;">${companyName}</span><br>
      <a href="mailto:${senderEmail}" style="color: #1976d2; text-decoration: none;">${senderEmail}</a>
    </div>
    <div style="font-size: 0.95em; color: #444; margin-bottom: 16px;">
      <strong>DISCLAIMER:</strong> ${disclaimer}
    </div>
    <div style="font-size: 0.95em; color: #444; margin-bottom: 16px;">
      ${companyName} | <strong>${address}</strong> | Fax: ${fax} |<br>
      <strong>Email:</strong> <a href="mailto:${contactEmail}" style="color: #1976d2;">${contactEmail}</a><br>
      <span style="font-weight: bold;">${copyright}</span>
    </div>
  </div>
  `;
} 