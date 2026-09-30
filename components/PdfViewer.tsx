'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const PdfViewer = ({ src }: { src: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const docRef = useRef<import('pdfjs-dist').PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
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
        if (!cancelled) setError('Could not render this PDF.');
      }
    })();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
      docRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || pageCount === 0) return;

    let renderTask: import('pdfjs-dist').RenderTask | null = null;
    (async () => {
      const pdfPage = await doc.getPage(page);
      const viewport = pdfPage.getViewport({ scale: 1.4 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      renderTask = pdfPage.render({ canvas, viewport });
      await renderTask.promise.catch(() => undefined);
    })();

    return () => renderTask?.cancel();
  }, [page, pageCount]);

  if (error) return <p className="body-2 text-center">{error}</p>;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="max-h-[65vh] w-full overflow-auto">
        <canvas
          ref={canvasRef}
          data-testid="pdf-canvas"
          className="mx-auto max-w-full"
        />
      </div>
      {pageCount > 1 && (
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="body-2">
            {page} / {pageCount}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
