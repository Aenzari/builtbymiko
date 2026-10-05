/**
 * Best-effort email notification when a new inquiry arrives. Entirely
 * optional: if RESEND_API_KEY isn't set, this silently does nothing, and
 * the message is still saved and readable at /admin/inquiries either way.
 * A failure here must never fail the form submission, so every error is
 * caught and logged, never thrown.
 */
export async function notifyNewInquiry(inquiry: {
  name: string;
  email: string;
  message: string;
  budget: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: inquiry.email,
      subject: `New inquiry from ${inquiry.name}`,
      text: `From: ${inquiry.name} <${inquiry.email}>\nType: ${inquiry.budget}\n\n${inquiry.message}\n\n— Read and reply from /admin/inquiries.`,
    });
  } catch (error) {
    console.error("Could not send inquiry notification email (message was still saved):", error);
  }
}
