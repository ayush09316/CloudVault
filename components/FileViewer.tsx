'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowDown, ArrowUp, LayoutGrid, List, Loader2 } from 'lucide-react';
import Sort from '@/components/Sort';
import FileCard, { LIST_GRID } from '@/components/FileCard';
import Card, { SelectModifiers } from '@/components/Card';
import FilePreview from '@/components/FilePreview';
import SelectionToolbar from '@/components/SelectionToolbar';
import FileEmptyState, { EmptyVariant } from '@/components/FileEmptyState';
import FileTooltip, { FileTooltipProvider } from '@/components/FileTooltip';
import { formatBytes } from '@/components/FileFormat';
import { cn } from '@/lib/utils';
import { getFiles } from '@/lib/actions/file.actions';
import { FileDocument, GetFilesProps } from '@/types';

type FileViewerProps = {
  files: FileDocument[];
  totalSize: number;
  type: string;
  mode?: 'browse' | 'trash';
  nextCursor?: string | null;
  query?: GetFilesProps;
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
  emptyText?: string;
  emptyVariant?: EmptyVariant;
  category?: string;
  subtitle?: React.ReactNode;
};

type View = 'list' | 'grid';
type SortField = 'name' | 'owner' | '$updatedAt' | 'size';
const VIEW_KEY = 'cloudvault:file-view';

const DEFAULT_DIR: Record<SortField, 'asc' | 'desc'> = {
  name: 'asc',
  owner: 'asc',
  $updatedAt: 'desc',
  size: 'desc',
};

const SortHeader = ({
  label,
  field,
  active,
  dir,
  align = 'left',
  onSort,
  className,
}: {
  label: string;
  field: SortField;
  active: boolean;
  dir: 'asc' | 'desc';
  align?: 'left' | 'right';
  onSort: (field: SortField) => void;
  className?: string;
}) => {
  const Arrow = dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <div
      role="columnheader"
      aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn('min-w-0', align === 'right' && 'text-right', className)}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          'fx-focus group/sort -mx-1.5 inline-flex h-7 max-w-full items-center gap-1 rounded-md px-1.5 text-[12px] font-medium transition-colors',
          align === 'right' && 'flex-row-reverse',
          active
            ? 'text-foreground'
            : 'text-muted-foreground hover:bg-ink-100 hover:text-foreground dark:hover:bg-ink-800'
        )}
      >
        <span className="truncate">{label}</span>
        <Arrow
          aria-hidden="true"
          className={cn(
            'size-3.5 shrink-0 transition-opacity',
            active ? 'opacity-100' : 'opacity-0 group-hover/sort:opacity-50'
          )}
        />
      </button>
    </div>
  );
};

const FileViewer = ({
  files: initialFiles,
  totalSize,
  type,
  mode = 'browse',
  nextCursor: initialCursor = null,
  query,
  header,
  toolbar,
  emptyText,
  emptyVariant,
  category,
  subtitle,
}: FileViewerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<View>('list');
  const [files, setFiles] = useState(initialFiles);
  const [cursor, setCursor] = useState(initialCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [ownerSort, setOwnerSort] = useState<'asc' | 'desc' | null>(null);
  const anchorRef = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_KEY);
      if (saved === 'grid' || saved === 'list') setView(saved);
    } catch {}
  }, []);

  const changeView = (next: View) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_KEY, next);
    } catch {}
  };

  useEffect(() => {
    setFiles(initialFiles);
    setCursor(initialCursor);
    setSelectedIds(
      (prev) =>
        new Set(
          [...prev].filter((id) => initialFiles.some((f) => f.$id === id))
        )
    );
  }, [initialFiles, initialCursor]);

  const sortParam = searchParams.get('sort') || '$createdAt-desc';
  const [sortField, sortDir] = sortParam.split('-') as [string, 'asc' | 'desc'];

  const ordered = useMemo(() => {
    if (!ownerSort) return files;
    const name = (f: FileDocument) => (f.owner?.fullName || '').toLowerCase();
    return [...files].sort((a, b) => {
      if (!!a.isFolder !== !!b.isFolder) return a.isFolder ? -1 : 1;
      const cmp = name(a).localeCompare(name(b));
      return ownerSort === 'asc' ? cmp : -cmp;
    });
  }, [files, ownerSort]);

  const folders = useMemo(() => ordered.filter((f) => f.isFolder), [ordered]);
  const plainFiles = useMemo(
    () => ordered.filter((f) => !f.isFolder),
    [ordered]
  );
  const visual = useMemo(
    () => (view === 'grid' ? [...folders, ...plainFiles] : ordered),
    [view, folders, plainFiles, ordered]
  );

  const selected = useMemo(
    () => visual.filter((f) => selectedIds.has(f.$id)),
    [visual, selectedIds]
  );

  const selectable = true;
  const selectionActive = selected.length > 0;

  const toggleSelect = useCallback(
    (file: FileDocument, mods: SelectModifiers = {}) => {
      const index = visual.findIndex((f) => f.$id === file.$id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (mods.shiftKey && anchorRef.current !== null) {
          const [a, b] = [anchorRef.current, index].sort((x, y) => x - y);
          for (let i = a; i <= b; i++) next.add(visual[i].$id);
        } else if (next.has(file.$id)) {
          next.delete(file.$id);
        } else {
          next.add(file.$id);
        }
        return next;
      });
      if (!mods.shiftKey) anchorRef.current = index;
    },
    [visual]
  );

  const allSelected = visual.length > 0 && selected.length === visual.length;
  const someSelected = selected.length > 0 && !allSelected;
  const selectAll = () => setSelectedIds(new Set(visual.map((f) => f.$id)));
  const clearSelection = () => {
    setSelectedIds(new Set());
    anchorRef.current = null;
  };

  const previewable = plainFiles;
  const previewIndex = previewId
    ? previewable.findIndex((f) => f.$id === previewId)
    : -1;

  const openFile = (file: FileDocument) => {
    if (mode === 'trash') return;
    if (file.isFolder) router.push(`/files?folder=${file.$id}`);
    else setPreviewId(file.$id);
  };

  const loadMore = useCallback(async () => {
    if (!cursor || !query || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await getFiles({ ...query, cursor });
      if (page) {
        setFiles((prev) => [...prev, ...page.documents]);
        setCursor(page.nextCursor);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, query, loadingMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !cursor) return;
    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [cursor, loadMore]);

  const onSort = (field: SortField) => {
    if (field === 'owner') {
      setOwnerSort((prev) =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
      );
      return;
    }
    setOwnerSort(null);
    const dir =
      sortField === field
        ? sortDir === 'asc'
          ? 'desc'
          : 'asc'
        : DEFAULT_DIR[field];
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', `${field}-${dir}`);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const activeField: SortField | null = ownerSort
    ? 'owner'
    : (['name', '$updatedAt', 'size'] as SortField[]).includes(
          sortField as SortField
        )
      ? (sortField as SortField)
      : null;
  const activeDir = ownerSort ?? sortDir;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        ((target.tagName === 'INPUT' &&
          !['checkbox', 'radio', 'button'].includes(
            (target as HTMLInputElement).type
          )) ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (e.key === 'Escape' && selectedIds.size > 0 && !typing) {
        clearSelection();
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'a' &&
        !typing &&
        gridRef.current?.contains(document.activeElement)
      ) {
        e.preventDefault();
        selectAll();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const onGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target.matches('[data-open-button]')) return;
    const buttons = Array.from(
      gridRef.current?.querySelectorAll<HTMLElement>('[data-open-button]') ?? []
    );
    const i = buttons.indexOf(target);
    if (i < 0) return;

    const focusAt = (j: number) => {
      const el = buttons[Math.max(0, Math.min(buttons.length - 1, j))];
      el?.focus();
      el
        ?.closest('[data-testid="file-item"]')
        ?.scrollIntoView({ block: 'nearest' });
    };

    const vertical = (dirn: 1 | -1) => {
      if (view === 'list') return focusAt(i + dirn);
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      let best: number | null = null;
      let bestScore = Infinity;
      buttons.forEach((b, j) => {
        const r = b.getBoundingClientRect();
        const dy = (r.top - rect.top) * dirn;
        if (dy <= 4) return;
        const score = dy * 4 + Math.abs(r.left + r.width / 2 - cx);
        if (score < bestScore) {
          bestScore = score;
          best = j;
        }
      });
      if (best !== null) focusAt(best);
    };

    const item = target.closest<HTMLElement>('[data-testid="file-item"]');
    const file = visual.find((f) => f.$id === item?.dataset.fileId);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (e.shiftKey && file) toggleSelect(file);
        vertical(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (e.shiftKey && file) toggleSelect(file);
        vertical(-1);
        break;
      case 'ArrowRight':
        if (view === 'grid') {
          e.preventDefault();
          focusAt(i + 1);
        }
        break;
      case 'ArrowLeft':
        if (view === 'grid') {
          e.preventDefault();
          focusAt(i - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        focusAt(0);
        break;
      case 'End':
        e.preventDefault();
        focusAt(buttons.length - 1);
        break;
      case ' ':
      case 'x':
        if (file && selectable) {
          e.preventDefault();
          toggleSelect(file, { shiftKey: e.shiftKey });
        }
        break;
    }
  };

  const itemProps = (file: FileDocument) => ({
    file,
    mode,
    selected: selectedIds.has(file.$id),
    selectionActive,
    onToggleSelect: selectable ? toggleSelect : undefined,
    onOpen: openFile,
  });

  const folderCount = folders.length;
  const fileCount = plainFiles.length;
  const more = cursor ? '+' : '';
  const summary = [
    folderCount > 0 &&
      `${folderCount}${more && !fileCount ? more : ''} ${folderCount === 1 ? 'folder' : 'folders'}`,
    fileCount > 0 &&
      `${fileCount}${more} ${fileCount === 1 ? 'file' : 'files'}`,
  ]
    .filter(Boolean)
    .join(', ');

  const variant: EmptyVariant =
    emptyVariant ??
    (mode === 'trash' ? 'trash' : query?.searchText ? 'search' : 'type');

  const clearSearchHref = (() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  })();

  return (
    <FileTooltipProvider>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="flex w-full flex-col gap-3">
          {header}
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <h1 className="truncate font-display text-[26px] font-semibold leading-8 tracking-[-0.018em] text-foreground first-letter:uppercase">
                {type}
              </h1>
              <p className="fx-num mt-1 text-[13px] text-muted-foreground">
                {subtitle ??
                  (files.length === 0 ? (
                    'No items'
                  ) : (
                    <>
                      {summary}
                      {totalSize > 0 && (
                        <>
                          <span
                            aria-hidden="true"
                            className="mx-1.5 text-ink-300 dark:text-ink-600"
                          >
                            /
                          </span>
                          {formatBytes(totalSize)}
                          {more}
                        </>
                      )}
                    </>
                  ))}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {toolbar}
              {mode === 'browse' && view === 'grid' && <Sort />}
              <div
                role="group"
                aria-label="View"
                className="hidden items-center rounded-lg border border-border bg-card p-0.5 sm:inline-flex"
              >
                {(
                  [
                    ['list', List, 'List view'],
                    ['grid', LayoutGrid, 'Grid view'],
                  ] as const
                ).map(([v, Icon, label]) => (
                  <FileTooltip key={v} label={label}>
                    <button
                      type="button"
                      aria-label={label}
                      aria-pressed={view === v}
                      onClick={() => changeView(v)}
                      className={cn(
                        'fx-focus inline-flex h-7 w-8 items-center justify-center rounded-md transition-colors',
                        view === v
                          ? 'bg-ink-100 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))] dark:bg-ink-800'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </button>
                  </FileTooltip>
                ))}
              </div>
            </div>
          </div>
        </header>

        {visual.length === 0 ? (
          <div className="fx-surface w-full border-dashed bg-transparent">
            <FileEmptyState
              variant={variant}
              category={category}
              title={emptyText}
              query={query?.searchText}
              clearHref={clearSearchHref}
            />
          </div>
        ) : view === 'list' ? (
          <div
            ref={gridRef}
            role="grid"
            aria-label={`${type} files`}
            aria-multiselectable={selectable || undefined}
            aria-busy={isPending || undefined}
            onKeyDown={onGridKeyDown}
            className={cn(
              'fx-surface w-full overflow-clip transition-opacity duration-200',
              isPending && 'opacity-60'
            )}
          >
            <div
              role="row"
              className={cn(
                'sticky top-0 z-20 grid h-10 items-center gap-x-3 rounded-t-xl border-b border-border bg-card/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-card/85',
                LIST_GRID[mode]
              )}
            >
              <div role="columnheader" className="flex items-center">
                {selectable && (
                  <input
                    type="checkbox"
                    aria-label={allSelected ? 'Deselect all' : 'Select all'}
                    className="fx-checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={() =>
                      allSelected ? clearSelection() : selectAll()
                    }
                  />
                )}
              </div>
              <SortHeader
                label="Name"
                field="name"
                active={activeField === 'name'}
                dir={activeField === 'name' ? activeDir : 'asc'}
                onSort={onSort}
              />
              <SortHeader
                label="Owner"
                field="owner"
                className="hidden lg:block"
                active={activeField === 'owner'}
                dir={activeField === 'owner' ? activeDir : 'asc'}
                onSort={onSort}
              />
              {mode === 'trash' ? (
                <div
                  role="columnheader"
                  className="hidden text-[12px] font-medium text-muted-foreground md:block"
                >
                  Deleted
                </div>
              ) : (
                <SortHeader
                  label="Modified"
                  field="$updatedAt"
                  className="hidden md:block"
                  active={activeField === '$updatedAt'}
                  dir={activeField === '$updatedAt' ? activeDir : 'desc'}
                  onSort={onSort}
                />
              )}
              <SortHeader
                label="Size"
                field="size"
                align="right"
                className="hidden md:block"
                active={activeField === 'size'}
                dir={activeField === 'size' ? activeDir : 'desc'}
                onSort={onSort}
              />
              <div role="columnheader" className="flex justify-end">
                {isPending && (
                  <Loader2
                    className="size-4 animate-spin text-muted-foreground"
                    aria-label="Sorting"
                  />
                )}
              </div>
            </div>
            <div
              role="rowgroup"
              className="animate-fade-in motion-reduce:animate-none"
            >
              {ordered.map((file) => (
                <FileCard key={file.$id} {...itemProps(file)} />
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={gridRef}
            aria-label={`${type} files`}
            aria-busy={isPending || undefined}
            onKeyDown={onGridKeyDown}
            className="flex w-full animate-fade-in flex-col gap-6 motion-reduce:animate-none"
          >
            {folders.length > 0 && (
              <section aria-label="Folders">
                <h2 className="mb-2.5 text-[12px] font-medium text-muted-foreground">
                  Folders
                </h2>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {folders.map((file) => (
                    <Card key={file.$id} {...itemProps(file)} />
                  ))}
                </div>
              </section>
            )}
            {plainFiles.length > 0 && (
              <section aria-label="Files">
                {folders.length > 0 && (
                  <h2 className="mb-2.5 text-[12px] font-medium text-muted-foreground">
                    Files
                  </h2>
                )}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {plainFiles.map((file) => (
                    <Card key={file.$id} {...itemProps(file)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {cursor && query && (
          <div ref={sentinelRef} className="flex justify-center py-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="fx-btn fx-btn-secondary"
            >
              {loadingMore && (
                <Loader2 className="animate-spin" aria-hidden="true" />
              )}
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}

        {selectable && (
          <SelectionToolbar
            selected={selected}
            total={visual.length}
            mode={mode}
            onClear={clearSelection}
            onSelectAll={selectAll}
          />
        )}

        <FilePreview
          file={previewIndex >= 0 ? previewable[previewIndex] : null}
          files={previewable}
          onNavigate={(f) => setPreviewId(f.$id)}
          onClose={() => setPreviewId(null)}
        />
      </div>
    </FileTooltipProvider>
  );
};

export default FileViewer;
