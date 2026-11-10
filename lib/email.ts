import 'server-only';
import type { ReactElement } from 'react';
import { render } from '@react-email/render';
import { Resend } from 'resend';

export type Mail = { to: string; subject: string; react: ReactElement; replyTo?: string };

/**
 * Sends one email through Resend. Without RESEND_API_KEY outside production, logs instead
 * so forms can be exercised locally. Returns false on failure (never throws).
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM ?? 'orders@premiumhammer.com';
  const html = await render(mail.react);
  const textBody = await render(mail.react, { plainText: true });
  if (!key) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[email:dev] to=${mail.to} subject=${mail.subject}\n${textBody}`);
      return true;
    }
    console.error('[email] RESEND_API_KEY is not set');
    return false;
  }
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: `Premium Hammer <${from}>`,
      to: mail.to,
      subject: mail.subject,
      html,
      text: textBody,
      replyTo: mail.replyTo,
    });
    if (error) {
      console.error('[email] Resend error', error.name, error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[email] send failed', e instanceof Error ? e.message : e);
    return false;
  }
}

export function ownerAddress() {
  return process.env.ORDER_EMAIL_TO ?? 'tomstroj@siol.net';
}
