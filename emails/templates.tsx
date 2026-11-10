import { EmailLayout, FieldTable, H, P, Accent } from './components';

/** Internal notification to Tomstroj: all fields in a clean table (English). */
export function OwnerEmail({ title, rows, preview }: { title: string; rows: [string, string | undefined][]; preview: string }) {
  return (
    <EmailLayout lang="en" preview={preview}>
      <H>{title}</H>
      <FieldTable rows={rows} />
    </EmailLayout>
  );
}

export type ConfirmationStrings = {
  lang: string;
  preview: string;
  hello: string;
  intro: string;
  next?: string;
  regards: string;
  team: string;
  refLabel?: string;
  ref?: string;
};

/** Confirmation to the buyer / enquirer in the site language. */
export function ConfirmationEmail({ s, rows }: { s: ConfirmationStrings; rows: [string, string | undefined][] }) {
  return (
    <EmailLayout lang={s.lang} preview={s.preview}>
      <P>{s.hello}</P>
      <P>{s.intro}</P>
      {s.ref ? (
        <P>
          {s.refLabel}: <Accent>{s.ref}</Accent>
        </P>
      ) : null}
      {rows.length ? <FieldTable rows={rows} /> : null}
      {s.next ? <P>{s.next}</P> : null}
      <P>
        {s.regards}
        <br />
        {s.team}
      </P>
    </EmailLayout>
  );
}
