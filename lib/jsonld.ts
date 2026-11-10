import { company, siteUrl } from '@/content/company';
import { product } from '@/content/product';
import { files } from '@/content/media';
import { localeUrl } from './seo';

export const organizationId = `${siteUrl}/#organization`;

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: company.shortName,
    legalName: company.legalName,
    url: siteUrl,
    logo: `${siteUrl}${files.logoBlack}`,
    email: company.email,
    telephone: company.phone,
    vatID: company.vatId,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.street,
      postalCode: company.postalCode,
      addressLocality: company.city,
      addressCountry: company.countryCode,
    },
    openingHours: company.hours.map((h) => h.schema),
  };
}

export function productJsonLd(opts: { locale: string; name: string; description: string; images: string[]; material: string }) {
  const url = localeUrl(opts.locale, '/hammer');
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: opts.name,
    description: opts.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    manufacturer: { '@id': organizationId },
    material: opts.material,
    weight: { '@type': 'QuantitativeValue', value: product.weightGrams, unitCode: 'GRM' },
    countryOfOrigin: 'SI',
    image: opts.images,
    url,
    // No aggregateRating and no review — by policy (no invented reviews).
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      sku: `${product.sku}-${v.id.toUpperCase()}`,
      url: `${url}?variant=${v.id}#order`,
      price: v.priceExclVat,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: v.priceExclVat,
        priceCurrency: product.currency,
        valueAddedTaxIncluded: false,
      },
      seller: { '@id': organizationId },
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

export function articleJsonLd(opts: { locale: string; headline: string; description: string; datePublished: string; dateModified: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    inLanguage: opts.locale,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    author: { '@type': 'Organization', name: company.shortName, url: siteUrl },
    publisher: { '@id': organizationId },
    mainEntityOfPage: localeUrl(opts.locale, '/guide'),
    image: opts.image,
  };
}
