'use client';

import { useEffect } from 'react';

const LandingFX = () => {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.cvl');
    if (!root) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const targets = root.querySelectorAll<HTMLElement>(
      '[data-reveal],[data-inview]'
    );

    if (reduced) {
      targets.forEach((el) => el.classList.add('is-in', 'in-view'));
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (el.hasAttribute('data-inview')) {
            el.classList.toggle('in-view', e.isIntersecting);
          }
          if (e.isIntersecting && el.hasAttribute('data-reveal')) {
            el.classList.add('is-in');
            if (!el.hasAttribute('data-inview')) io.unobserve(el);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
    );
    if (!reduced) targets.forEach((el) => io.observe(el));
    root.classList.add('cvl-ready');

    const fallback = window.setTimeout(() => {
      root
        .querySelectorAll<HTMLElement>('[data-reveal]')
        .forEach((el) => el.classList.add('is-in'));
    }, 2500);

    const nav = root.querySelector<HTMLElement>('[data-cvl-nav]');
    const onScroll = () =>
      nav?.setAttribute('data-scrolled', String(window.scrollY > 8));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
};

export default LandingFX;
