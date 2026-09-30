'use client';

import { useEffect, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

const DropOverlay = () => {
  const [active, setActive] = useState(false);
  const depth = useRef(0);

  useEffect(() => {
    const hasFiles = (e: DragEvent) =>
      Array.from(e.dataTransfer?.types ?? []).includes('Files');

    const onDragEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth.current += 1;
      setActive(true);
    };
    const onDragOver = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
    };
    const onDragLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setActive(false);
    };
    const onDrop = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth.current = 0;
      setActive(false);
      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length) {
        window.dispatchEvent(
          new CustomEvent('cloudvault:files-dropped', { detail: { files } })
        );
      }
    };

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex animate-fade-in items-center justify-center bg-background/80 backdrop-blur-sm"
      role="presentation"
    >
      <div className="cv-check-pop flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-vault-600 bg-card px-16 py-14 text-center shadow-soft-lg dark:border-vault-400">
        <div className="flex size-16 items-center justify-center rounded-full bg-vault-600/10 text-vault-600 dark:bg-vault-400/10 dark:text-vault-300">
          <UploadCloud className="size-8" aria-hidden="true" />
        </div>
        <div>
          <p className="h4 font-display">Drop to upload</p>
          <p className="body-2 text-muted-foreground">
            Release to add these files to CloudVault
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropOverlay;
