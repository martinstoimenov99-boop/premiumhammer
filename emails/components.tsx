import type { ReactNode } from 'react';
import { Body, Container, Head, Hr, Html, Preview, Section, Text } from '@react-email/components';
import { company } from '@/content/company';

const c = { ink: '#1E1F22', copper: '#B87333', tint: '#EADBCB', paper: '#F5F2EE', steel: '#6B6B6B', line: '#DDD6CE' };
const font = "Inter, 'Helvetica Neue', Arial, sans-serif";

export function EmailLayout({ lang, preview, children }: { lang: string; preview: string; children: ReactNode }) {
  return (
    <Html lang={lang}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ background: c.paper, margin: 0, padding: '24px 0', fontFamily: font, color: c.ink }}>
        <Container style={{ maxWidth: 600, background: '#ffffff', borderRadius: 8, overflow: 'hidden' }}>
          <Section style={{ background: c.ink, padding: '20px 28px', borderBottom: `3px solid ${c.copper}` }}>
            <Text style={{ margin: 0, color: '#ffffff', fontSize: 15, fontWeight: 700, letterSpacing: '0.12em' }}>
              TOMSTROJ <span style={{ color: '#8a8a8a' }}>|</span> PREMIUM <span style={{ color: c.copper }}>HAMMER</span>
            </Text>
          </Section>
          <Section style={{ padding: '28px' }}>{children}</Section>
          <Hr style={{ borderColor: c.line, margin: 0 }} />
          <Section style={{ padding: '20px 28px' }}>
            <Text style={{ margin: 0, fontSize: 13, lineHeight: '20px', color: c.steel }}>
              {company.shortName} · {company.street}, {company.postalCode} {company.city}, Slovenia
              <br />
              {company.phone} · {company.email} · VAT {company.vatId}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function P({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <Text style={{ margin: '0 0 14px', fontSize: 15, lineHeight: '24px', color: muted ? c.steel : c.ink }}>{children}</Text>;
}

export function H({ children }: { children: ReactNode }) {
  return <Text style={{ margin: '0 0 16px', fontSize: 22, lineHeight: '28px', fontWeight: 700 }}>{children}</Text>;
}

export function Accent({ children }: { children: ReactNode }) {
  return <span style={{ color: c.copper, fontWeight: 700 }}>{children}</span>;
}

/** Clean two-column table of label/value rows. */
export function FieldTable({ rows }: { rows: [string, string | undefined][] }) {
  return (
    <table cellPadding={0} cellSpacing={0} role="presentation" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, margin: '8px 0 20px' }}>
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={k} style={{ background: i % 2 === 0 ? '#F6EEE5' : '#ffffff' }}>
            <td style={{ padding: '9px 12px', color: c.steel, width: '38%', verticalAlign: 'top' }}>{k}</td>
            <td style={{ padding: '9px 12px', color: c.ink, verticalAlign: 'top', whiteSpace: 'pre-wrap' }}>{v && v.length ? v : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
