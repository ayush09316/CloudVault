'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { CornerDownLeft, Loader2, Search as SearchIcon, X } from 'lucide-react';
import { getFiles } from '@/lib/actions/file.actions';
import { FileThumb } from '@/components/Thumbnail';
import { formatShortDate } from '@/components/FileFormat';
import { fileKindLabel, getFileKind } from '@/components/FileTypeIcon';
import { cn } from '@/lib/utils';
import { FileDocument } from '@/types';

const routeFor = (file: FileDocument) =>
  file.type === 'video' || file.type === 'audio' ? 'media' : `${file.type}s`;

const Highlight = ({ text, query }: { text: string; query: string }) => {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[2px] bg-vault-600/15 text-inherit dark:bg-vault-400/25">
        {text.slice(i, i + query.length)}
      </mark>
      {text.slice(i + query.length)}
    </>
  );
};

const Search = () => {
  const [query, setQuery] = useState('');
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [results, setResults] = useState<FileDocument[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 250);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const touched = useRef(false);
  const listId = useId();

  useEffect(() => {
    let live = true;
    const q = debouncedQuery.trim();
    if (q.length === 0) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      if (touched.current && searchQuery) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('query');
        const qs = params.toString();
        router.push(qs ? `${path}?${qs}` : path);
      }
      return;
    }
    setLoading(true);
    getFiles({ types: [], searchText: q, limit: 8 })
      .then((files) => {
        if (!live) return;
        setResults(files?.documents ?? []);
        setActive(0);
        setOpen(true);
      })
      .catch(() => live && setResults([]))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) setQuery('');
  }, [searchQuery]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(
          t &&
          (t.isContentEditable ||
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))
        ) &&
        !document.querySelector('[role="dialog"]')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const go = (file: FileDocument) => {
    setOpen(false);
    setResults([]);
    router.push(`/${routeFor(file)}?query=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && open && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      if (open) setOpen(false);
      else if (query) setQuery('');
      else inputRef.current?.blur();
    }
  };

  const showPanel = open && debouncedQuery.trim().length > 0;

  return (
    <div className="relative w-full md:max-w-[520px]" ref={searchRef}>
      <div
        className={cn(
          'group flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 transition-[border-color,box-shadow] duration-150 focus-within:border-vault-600 focus-within:ring-[3px] focus-within:ring-vault-600/15 hover:border-ink-300 dark:focus-within:border-vault-400 dark:focus-within:ring-vault-400/20 dark:hover:border-ink-600',
          showPanel && 'rounded-b-none'
        )}
      >
        {loading ? (
          <Loader2
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin text-muted-foreground"
          />
        ) : (
          <SearchIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
        )}
        <input
          ref={inputRef}
          value={query}
          placeholder="Search files"
          aria-label="Search files"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showPanel && results[active]
              ? `${listId}-${results[active].$id}`
              : undefined
          }
          className="h-full min-w-0 flex-1 bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
          onChange={(e) => {
            touched.current = true;
            setQuery(e.target.value);
          }}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            className="fx-icon-btn size-6"
            onClick={() => {
              touched.current = true;
              setQuery('');
              inputRef.current?.focus();
            }}
          >
            <X className="!size-3.5" />
          </button>
        ) : (
          <kbd className="fx-kbd hidden sm:inline-flex" aria-hidden="true">
            /
          </kbd>
        )}
      </div>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 overflow-hidden rounded-b-lg border border-t-0 border-border bg-popover shadow-[0_16px_40px_-16px_rgba(10,13,12,0.3)]">
          {results.length > 0 ? (
            <ul
              id={listId}
              role="listbox"
              aria-label="Search results"
              className="max-h-[360px] overflow-y-auto p-1"
            >
              {results.map((file, i) => (
                <li
                  key={file.$id}
                  id={`${listId}-${file.$id}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(file)}
                  className={cn(
                    'flex h-11 cursor-pointer items-center gap-3 rounded-md px-2',
                    i === active && 'bg-ink-100 dark:bg-ink-800'
                  )}
                >
                  <FileThumb file={file} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-foreground">
                      <Highlight
                        text={file.name}
                        query={debouncedQuery.trim()}
                      />
                    </p>
                    <p className="fx-num truncate text-[11.5px] text-muted-foreground">
                      {fileKindLabel(getFileKind(file.extension, file.type))} ·{' '}
                      {formatShortDate(file.$updatedAt)}
                    </p>
                  </div>
                  {i === active && (
                    <CornerDownLeft
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-muted-foreground"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-[13px] text-muted-foreground">
              No files match “{debouncedQuery.trim()}”
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
