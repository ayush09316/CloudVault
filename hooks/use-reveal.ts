'use client';

import { useEffect, useRef } from 'react';

let io: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function ensureObserver() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callbacks.get(entry.target)?.();
          io?.unobserve(entry.target);
          callbacks.delete(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px 15% 0px', threshold: 0.01 }
  );
  return io;
}

export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.add('is-in');
      return;
    }

    el.style.setProperty('--reveal-delay', `${delay}ms`);
    const observer = ensureObserver();
    const reveal = () => el.classList.add('is-in');
    callbacks.set(el, reveal);
    observer.observe(el);

    // Safety net: never leave content permanently hidden if the observer
    // is slow (e.g. during a full-page capture that resizes the viewport).
    const fallback = window.setTimeout(reveal, 1500);

    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
      window.clearTimeout(fallback);
    };
  }, [delay]);

  return ref;
}
