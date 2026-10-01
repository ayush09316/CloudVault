'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const ZOOMS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const PdfViewer = ({ src, dark = false }: { src: string; dark?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const docRef = useRef<import('pdfjs-dist').PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(0);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: import('pdfjs-dist').PDFDocumentLoadingTask | null = null;

    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        loadingTask = pdfjs.getDocument({ url: src, withCredentials: true });
        const doc = await loadingTask.promise;
        if (cancelled) return;
        docRef.current = doc;
        setPageCount(doc.numPages);
        setPage(1);
      } catch (e) {
        console.error('Failed to load PDF', e);
        if (!cancelled) setError('This PDF couldn’t be rendered.');
      }
    })();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
      docRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width))
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || pageCount === 0 || width === 0) return;

    let renderTask: import('pdfjs-dist').RenderTask | null = null;
    let alive = true;
    setRendering(true);
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (!alive) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const fit = Math.min(width, 920) / base.width;
      const cssScale = fit * zoom;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: cssScale * dpr });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;
      renderTask = pdfPage.render({ canvas, viewport });
      await renderTask.promise.catch(() => undefined);
      if (alive) setRendering(false);
    })();

    return () => {
      alive = false;
      renderTask?.cancel();
    };
  }, [page, pageCount, zoom, width]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'PageDown') {
        e.preventDefault();
        setPage((p) => Math.min(pageCount, p + 1));
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        setPage((p) => Math.max(1, p - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pageCount]);

  const btn = cn(
    'inline-flex size-8 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 [&_svg]:size-4',
    dark
      ? 'text-ink-200 hover:bg-white/10 hover:text-white focus-visible:ring-vault-300/70'
      : 'text-muted-foreground hover:bg-ink-100 hover:text-foreground focus-visible:ring-vault-600/60 dark:hover:bg-ink-800'
  );

  if (error) {
    return (
      <p
        className={cn(
          'text-[13px]',
          dark ? 'text-ink-300' : 'text-muted-foreground'
        )}
      >
        {error}
      </p>
    );
  }

  const zi = ZOOMS.indexOf(zoom);

  return (
    <div className="flex size-full min-h-0 flex-col items-center gap-3">
      <div
        ref={wrapRef}
        className="relative min-h-0 w-full flex-1 overflow-auto"
      >
        {(rendering || pageCount === 0) && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute left-1/2 top-0 aspect-[1/1.294] w-full max-w-[min(100%,920px)] -translate-x-1/2 rounded-sm',
              dark ? 'bg-white/[0.04]' : 'fx-skeleton'
            )}
          />
        )}
        <canvas
          ref={canvasRef}
          data-testid="pdf-canvas"
          aria-label={
            pageCount ? `Page ${page} of ${pageCount}` : 'Loading PDF'
          }
          className={cn(
            'relative mx-auto block rounded-sm bg-white transition-opacity duration-150',
            dark
              ? 'shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]'
              : 'shadow-[0_1px_2px_rgba(10,13,12,0.08),0_8px_24px_-12px_rgba(10,13,12,0.25)] ring-1 ring-border',
            rendering ? 'opacity-0' : 'opacity-100'
          )}
        />
      </div>
      {pageCount > 0 && (
        <div
          role="toolbar"
          aria-label="PDF controls"
          className={cn(
            'flex shrink-0 items-center gap-0.5 rounded-lg p-0.5',
            dark ? 'bg-white/[0.06]' : 'border border-border bg-card'
          )}
        >
          <button
            type="button"
            className={btn}
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </button>
          <span
            className={cn(
              'fx-num min-w-[64px] text-center text-[12.5px]',
              dark ? 'text-ink-200' : 'text-foreground'
            )}
            aria-live="polite"
          >
            {page} / {pageCount}
          </span>
          <button
            type="button"
            className={btn}
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </button>
          <span
            aria-hidden="true"
            className={cn('mx-1 h-4 w-px', dark ? 'bg-white/15' : 'bg-border')}
          />
          <button
            type="button"
            className={btn}
            aria-label="Zoom out"
            disabled={zi <= 0}
            onClick={() => setZoom(ZOOMS[Math.max(0, zi - 1)])}
          >
            <Minus />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className={cn(
              'fx-num h-8 min-w-[48px] rounded-md text-[12px] font-medium focus-visible:outline-none focus-visible:ring-2',
              dark
                ? 'text-ink-200 hover:bg-white/10 focus-visible:ring-vault-300/70'
                : 'text-muted-foreground hover:bg-ink-100 focus-visible:ring-vault-600/60 dark:hover:bg-ink-800'
            )}
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            className={btn}
            aria-label="Zoom in"
            disabled={zi >= ZOOMS.length - 1}
            onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, zi + 1)])}
          >
            <Plus />
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
