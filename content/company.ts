export const company = {
  shortName: 'Tomstroj d.o.o.',
  legalName: 'TOMSTROJ, podjetje za inženiring, strojegradnjo in trgovino d.o.o.',
  street: 'Podovnice 1',
  postalCode: '1357',
  city: 'Notranje Gorice',
  country: 'Slovenia',
  countryCode: 'SI',
  businessUnit: 'Pod Hruševco 42, Vrhnika',
  registrationNo: '5525039000',
  vatId: 'SI96758252',
  phone: '+386 41 588 114',
  phoneHref: 'tel:+38641588114',
  email: 'tomstroj@siol.net',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Podovnice+1,+1357+Notranje+Gorice,+Slovenia',
  hours: [
    { days: 'monFri', open: '08:00', close: '16:00', schema: 'Mo-Fr 08:00-16:00' },
    { days: 'sat', open: '08:00', close: '12:00', schema: 'Sa 08:00-12:00' },
  ],
} as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://premiumhammer.com').replace(/\/$/, '');
