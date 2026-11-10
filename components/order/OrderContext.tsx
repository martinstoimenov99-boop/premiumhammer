'use client';

import { createContext, Suspense, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseVariant, product, type VariantId } from '@/content/product';

type OrderState = { variant: VariantId; setVariant: (v: VariantId) => void; qty: number; setQty: (q: number) => void };

const Ctx = createContext<OrderState | null>(null);

export function clampQty(n: number) {
  if (!Number.isFinite(n)) return product.quantity.min;
  return Math.min(product.quantity.max, Math.max(product.quantity.min, Math.round(n)));
}

/** Shared state for the buy box and the order form, seeded from `?variant=` and `?qty=`. */
export function OrderProvider({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<VariantId>('nocase');
  const [qty, setQtyRaw] = useState(1);
  const value = useMemo(() => ({ variant, setVariant, qty, setQty: (q: number) => setQtyRaw(clampQty(q)) }), [variant, qty]);
  return (
    <Ctx.Provider value={value}>
      <Suspense fallback={null}>
        <SearchParamsSync />
      </Suspense>
      {children}
    </Ctx.Provider>
  );
}

function SearchParamsSync() {
  const params = useSearchParams();
  const ctx = useOrder();
  const v = parseVariant(params.get('variant'));
  const q = params.get('qty');
  useEffect(() => {
    if (v) ctx.setVariant(v);
    if (q) ctx.setQty(Number(q));
    // Only re-run when the URL values change.
  }, [v, q]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export function useOrder() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOrder outside OrderProvider');
  return c;
}
