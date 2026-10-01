'use client';

/* eslint-disable @next/next/no-img-element */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  Loader2,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import FileTypeIcon, {
  fileKindLabel,
  getFileKind,
} from '@/components/FileTypeIcon';
import FileTooltip, { FileTooltipProvider } from '@/components/FileTooltip';
import { PreviewDetails } from '@/components/PreviewDetails';
import { fileContentUrl, getPreviewKind, thumbnailUrl } from '@/lib/preview';
import { cn } from '@/lib/utils';
import { FileDocument } from '@/types';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] items-center justify-center text-[13px] text-muted-foreground">
      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
      Loading PDF…
    </div>
  ),
});

const ZOOM_STEPS = [0.5, 0.75, 1, 1.5, 2, 3, 4];

const ZoomableImage = ({
  src,
  alt,
  zoom,
  setZoom,
  placeholder,
}: {
  src: string;
  alt: string;
  placeholder?: string;
  zoom: number;
  setZoom: (z: number) => void;
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; sl: number; st: number } | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const imgRef = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);

  const zoomed = zoom > 1;

  if (failed) {
    return (
      <p className="text-[13px] text-ink-300">This image couldn’t be loaded.</p>
    );
  }

  return (
    <div
      ref={stageRef}
      data-zoomed={zoomed}
      className={cn(
        'fx-zoom-stage relative flex size-full overflow-auto',
        zoomed ? 'items-start justify-start' : 'items-center justify-center'
      )}
      onClick={(e) => {
        if (
          drag.current?.x !== undefined &&
          Math.abs(drag.current.x - e.clientX) > 3
        )
          return;
        if (zoom === 1) {
          const stage = stageRef.current;
          const rect = stage?.getBoundingClientRect();
          setZoom(2);
          if (stage && rect) {
            const fx = (e.clientX - rect.left) / rect.width;
            const fy = (e.clientY - rect.top) / rect.height;
            requestAnimationFrame(() => {
              stage.scrollLeft = fx * stage.scrollWidth - rect.width / 2;
              stage.scrollTop = fy * stage.scrollHeight - rect.height / 2;
            });
          }
        } else {
          setZoom(1);
        }
      }}
      onPointerDown={(e) => {
        const stage = stageRef.current;
        if (!stage) return;
        drag.current = {
          x: e.clientX,
          y: e.clientY,
          sl: stage.scrollLeft,
          st: stage.scrollTop,
        };
      }}
      onPointerMove={(e) => {
        const stage = stageRef.current;
        if (!zoomed || !drag.current || !stage || e.buttons !== 1) return;
        stage.scrollLeft = drag.current.sl - (e.clientX - drag.current.x);
        stage.scrollTop = drag.current.st - (e.clientY - drag.current.y);
      }}
      onPointerUp={() => {
        window.setTimeout(() => (drag.current = null), 0);
      }}
    >
      {!loaded && placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-auto max-h-full max-w-full scale-[1.01] select-none object-contain opacity-80 blur-md"
        />
      )}
      {!loaded && (
        <Loader2
          className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin text-ink-200"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        ref={imgRef}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={
          zoomed
            ? { width: `${zoom * 100}%`, maxWidth: 'none', maxHeight: 'none' }
            : { transform: `scale(${zoom})` }
        }
        className={cn(
          'relative m-auto shrink-0 select-none object-contain transition-opacity duration-200',
          !zoomed && 'max-h-full max-w-full',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
};

export const FilePreviewBody = ({
  file,
  token,
  variant = 'card',
  zoom = 1,
  setZoom,
}: {
  file: Pick<FileDocument, '$id' | 'name' | 'extension'> &
    Partial<FileDocument>;
  token?: string | null;
  variant?: 'card' | 'stage';
  zoom?: number;
  setZoom?: (z: number) => void;
}) => {
  const src = fileContentUrl(file.$id, { token });
  const downloadHref = fileContentUrl(file.$id, { token, download: true });
  const kind = getPreviewKind(file.extension);
  const [localZoom, setLocalZoom] = useState(1);
  const z = setZoom ? zoom : localZoom;
  const setZ = setZoom ?? setLocalZoom;

  return (
    <div
      className={cn(
        'flex size-full min-h-0 flex-col items-center justify-center',
        variant === 'card' && 'gap-4'
      )}
      data-testid="preview"
    >
      {kind === 'image' &&
        (variant === 'stage' ? (
          <ZoomableImage
            src={src}
            alt={file.name}
            placeholder={
              file.thumbnailBucketFileId
                ? thumbnailUrl(file.$id, token)
                : undefined
            }
            zoom={z}
            setZoom={setZ}
          />
        ) : (
          <img
            src={src}
            alt={file.name}
            className="max-h-[70vh] max-w-full rounded-lg object-contain"
          />
        ))}
      {kind === 'video' && (
        <video
          key={src}
          src={src}
          controls
          playsInline
          className="max-h-full max-w-full rounded-lg bg-black"
        />
      )}
      {kind === 'audio' && (
        <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-xl border border-white/10 bg-white/[0.03] p-8">
          <FileTypeIcon type="audio" extension={file.extension} size="lg" />
          <audio key={src} src={src} controls className="w-full" />
        </div>
      )}
      {kind === 'pdf' && <PdfViewer src={src} dark={variant === 'stage'} />}
      {kind === 'none' && (
        <div className="flex flex-col items-center gap-4 text-center">
          <FileTypeIcon type={file.type} extension={file.extension} size="lg" />
          <div>
            <p
              className={cn(
                'text-[14px] font-medium',
                variant === 'stage' ? 'text-ink-100' : 'text-foreground'
              )}
            >
              No preview available
            </p>
            <p
              className={cn(
                'mt-1 text-[13px]',
                variant === 'stage' ? 'text-ink-400' : 'text-muted-foreground'
              )}
            >
              .{file.extension || 'unknown'} files can’t be previewed in the
              browser.
            </p>
          </div>
          <a
            href={downloadHref}
            download={file.name}
            className="fx-btn fx-btn-primary"
          >
            <Download aria-hidden="true" />
            Download
          </a>
        </div>
      )}
    </div>
  );
};

const stageBtn =
  'inline-flex size-9 items-center justify-center rounded-lg text-ink-200 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15 disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-300/70 [&_svg]:size-[18px]';

const FilePreview = ({
  file,
  files,
  onNavigate,
  onClose,
}: {
  file: FileDocument | null;
  files?: FileDocument[];
  onNavigate?: (file: FileDocument) => void;
  onClose: () => void;
}) => {
  const [zoom, setZoom] = useState(1);
  const [infoOpen, setInfoOpen] = useState(false);
  const list = useMemo(
    () => (files && file ? files : file ? [file] : []),
    [files, file]
  );
  const index = file ? list.findIndex((f) => f.$id === file.$id) : -1;
  const hasPrev = index > 0 && !!onNavigate;
  const hasNext = index >= 0 && index < list.length - 1 && !!onNavigate;
  const kind = file ? getPreviewKind(file.extension) : 'none';

  useEffect(() => setZoom(1), [file?.$id]);

  useEffect(() => {
    try {
      setInfoOpen(
        window.localStorage.getItem('cloudvault:preview-info') === '1'
      );
    } catch {}
  }, []);

  const toggleInfo = () =>
    setInfoOpen((v) => {
      try {
        window.localStorage.setItem('cloudvault:preview-info', v ? '0' : '1');
      } catch {}
      return !v;
    });

  const go = useCallback(
    (delta: number) => {
      const next = list[index + delta];
      if (next && onNavigate) onNavigate(next);
    },
    [list, index, onNavigate]
  );

  const stepZoom = (dir: 1 | -1) => {
    const i = ZOOM_STEPS.findIndex((s) => s >= zoom);
    const cur = i < 0 ? ZOOM_STEPS.length - 1 : i;
    const next =
      ZOOM_STEPS[Math.max(0, Math.min(ZOOM_STEPS.length - 1, cur + dir))];
    setZoom(next);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (t.tagName === 'INPUT' || t.tagName === 'VIDEO' || t.tagName === 'AUDIO')
      return;
    if (e.key === 'ArrowLeft' && hasPrev) {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'ArrowRight' && hasNext) {
      e.preventDefault();
      go(1);
    } else if (kind === 'image' && (e.key === '+' || e.key === '=')) {
      e.preventDefault();
      stepZoom(1);
    } else if (kind === 'image' && e.key === '-') {
      e.preventDefault();
      stepZoom(-1);
    } else if (kind === 'image' && e.key === '0') {
      e.preventDefault();
      setZoom(1);
    } else if (e.key === 'i' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      toggleInfo();
    }
  };

  const downloadHref = file
    ? fileContentUrl(file.$id, { download: true })
    : '#';

  return (
    <DialogPrimitive.Root
      open={!!file}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-ink-950/[0.94] backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:!animate-none" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
          className="fixed inset-0 z-[80] flex flex-col text-ink-100 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.985] motion-reduce:!animate-none"
        >
          {file && (
            <FileTooltipProvider>
              <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.07] px-3 sm:px-4">
                <DialogPrimitive.Close
                  className={stageBtn}
                  aria-label="Close preview"
                >
                  <X />
                </DialogPrimitive.Close>
                <FileTypeIcon
                  type={file.type}
                  extension={file.extension}
                  size="sm"
                  className="hidden sm:inline-flex"
                />
                <div className="min-w-0 flex-1">
                  <DialogPrimitive.Title className="truncate text-[14px] font-medium leading-5 text-white">
                    {file.name}
                  </DialogPrimitive.Title>
                  <p className="fx-num truncate text-[12px] leading-4 text-ink-400">
                    {fileKindLabel(getFileKind(file.extension, file.type))}
                    {list.length > 1 && index >= 0 && (
                      <>
                        <span aria-hidden="true" className="mx-1.5">
                          ·
                        </span>
                        {index + 1} of {list.length}
                      </>
                    )}
                  </p>
                </div>

                {kind === 'image' && (
                  <div className="hidden items-center rounded-lg bg-white/[0.06] p-0.5 sm:flex">
                    <FileTooltip label="Zoom out" kbd={['−']}>
                      <button
                        type="button"
                        aria-label="Zoom out"
                        className={cn(stageBtn, 'size-8')}
                        onClick={() => stepZoom(-1)}
                        disabled={zoom <= ZOOM_STEPS[0]}
                      >
                        <Minus />
                      </button>
                    </FileTooltip>
                    <FileTooltip label="Reset zoom" kbd={['0']}>
                      <button
                        type="button"
                        className="fx-num h-8 min-w-[52px] rounded-md px-1 text-[12px] font-medium text-ink-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-300/70"
                        onClick={() => setZoom(1)}
                      >
                        {Math.round(zoom * 100)}%
                      </button>
                    </FileTooltip>
                    <FileTooltip label="Zoom in" kbd={['+']}>
                      <button
                        type="button"
                        aria-label="Zoom in"
                        className={cn(stageBtn, 'size-8')}
                        onClick={() => stepZoom(1)}
                        disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
                      >
                        <Plus />
                      </button>
                    </FileTooltip>
                  </div>
                )}

                <FileTooltip label="Download">
                  <a
                    href={downloadHref}
                    download={file.name}
                    className={stageBtn}
                    aria-label={`Download ${file.name}`}
                  >
                    <Download />
                  </a>
                </FileTooltip>
                <FileTooltip
                  label={infoOpen ? 'Hide details' : 'Show details'}
                  kbd={['I']}
                >
                  <button
                    type="button"
                    aria-label="Details"
                    aria-pressed={infoOpen}
                    className={cn(
                      stageBtn,
                      infoOpen && 'bg-white/10 text-white'
                    )}
                    onClick={toggleInfo}
                  >
                    <Info />
                  </button>
                </FileTooltip>
              </header>

              <div className="flex min-h-0 flex-1">
                <div className="relative flex min-w-0 flex-1 items-center justify-center">
                  <div className="size-full p-4 sm:px-16 sm:py-6">
                    <FilePreviewBody
                      key={file.$id}
                      file={file}
                      variant="stage"
                      zoom={zoom}
                      setZoom={setZoom}
                    />
                  </div>
                  {hasPrev && (
                    <FileTooltip label="Previous" kbd={['←']} side="right">
                      <button
                        type="button"
                        aria-label="Previous file"
                        onClick={() => go(-1)}
                        className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 text-ink-100 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-300/70"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                    </FileTooltip>
                  )}
                  {hasNext && (
                    <FileTooltip label="Next" kbd={['→']} side="left">
                      <button
                        type="button"
                        aria-label="Next file"
                        onClick={() => go(1)}
                        className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 text-ink-100 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-300/70"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </FileTooltip>
                  )}
                </div>

                {infoOpen && (
                  <aside
                    aria-label="File details"
                    className="hidden w-[320px] shrink-0 overflow-y-auto border-l border-white/[0.07] bg-ink-950/60 md:block"
                  >
                    <PreviewDetails file={file} />
                  </aside>
                )}
              </div>
            </FileTooltipProvider>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default FilePreview;
