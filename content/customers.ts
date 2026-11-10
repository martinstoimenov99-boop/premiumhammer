/**
 * Permission to name these customers was confirmed by the owner. Replace a wordmark
 * with the official logo only after that company supplies the file and approves its use.
 *
 * Customer names appear only in the CustomerStrip component. Lines are translated in
 * messages (`customers.<id>`).
 */
export const customers = [
  { id: 'ekoling', wordmark: 'Ekoling d.o.o.' },
  { id: 'eoat', wordmark: 'Eoat Experts d.o.o.' },
  { id: 'tehkom', wordmark: 'TEHKOM' },
  { id: 'trelleborg', wordmark: 'TRELLEBORG' },
  // TODO(owner): city for Auto Repair Scorpion.
  { id: 'scorpion', wordmark: 'AUTO REPAIR SCORPION' },
  { id: 'mebelvi', wordmark: 'MEBEL VI' },
  { id: 'bikerguard', wordmark: 'Bikerguard' },
] as const;
