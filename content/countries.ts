/** Delivery countries: EU-27 + Western Balkans, Switzerland, Norway, UK (ISO 3166-1 alpha-2). */
export const euCountries = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
] as const;

export const otherCountries = ['RS', 'BA', 'MK', 'ME', 'AL', 'XK', 'CH', 'NO', 'GB'] as const;

export const deliveryCountries = [...euCountries, ...otherCountries] as const;
export type CountryCode = (typeof deliveryCountries)[number];

export function isDeliveryCountry(v: string): v is CountryCode {
  return (deliveryCountries as readonly string[]).includes(v);
}

/** VIES uses "EL" for Greece; "XI" covers Northern Ireland. */
export const viesPrefixes = new Set<string>([...euCountries.filter((c) => c !== 'GR'), 'EL', 'XI']);

export function sortedCountryOptions(locale: string) {
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  return deliveryCountries
    .map((code) => ({ code, name: names.of(code) ?? code }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
