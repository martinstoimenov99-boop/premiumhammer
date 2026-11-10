/**
 * Real customer quotes only. Add an entry ONLY with the customer's written permission,
 * their name, company and the exact quote. Never add placeholder or invented testimonials:
 * fake reviews are banned under EU consumer law (Directive 2005/29/EC as amended by
 * Directive (EU) 2019/2161).
 *
 * TODO(owner): real customer quote with written permission.
 */
export type Testimonial = {
  quote: Record<'en' | 'sl' | 'de', string>;
  name: string;
  role?: string;
  company: string;
  city: string;
  permissionConfirmedOn: string; // ISO date of the written permission
};

export const testimonials: Testimonial[] = [];
