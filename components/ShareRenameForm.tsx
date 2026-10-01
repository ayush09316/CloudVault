'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { renameFile } from '@/lib/actions/file.actions';
import { cn } from '@/lib/utils';

const ShareRenameForm = ({
  fileId,
  token,
  name,
  extension,
}: {
  fileId: string;
  token: string;
  name: string;
  extension: string;
}) => {
  const path = usePathname();
  const router = useRouter();
  const initial = extension
    ? name.replace(new RegExp(`\\.${extension}$`, 'i'), '')
    : name;
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  );

  const submit = async () => {
    if (!value.trim() || value.trim() === initial) return;
    setStatus('saving');
    try {
      await renameFile({
        fileId,
        name: value.trim(),
        extension,
        path,
        shareToken: token,
      });
      setStatus('saved');
      router.refresh();
    } catch {
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-1.5"
    >
      <label
        htmlFor="share-rename"
        className="text-[12.5px] font-medium text-muted-foreground"
      >
        Rename file
      </label>
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-stretch">
          <input
            id="share-rename"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (status !== 'saving') setStatus('idle');
            }}
            className={cn('fx-input', extension && 'rounded-r-none')}
          />
          {extension && (
            <span className="fx-num inline-flex items-center rounded-r-lg border border-l-0 border-input bg-ink-50 px-2.5 text-[13px] text-muted-foreground dark:bg-ink-800">
              .{extension}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="fx-btn fx-btn-secondary"
          disabled={
            status === 'saving' || !value.trim() || value.trim() === initial
          }
        >
          {status === 'saving' && (
            <Loader2 className="animate-spin" aria-hidden="true" />
          )}
          Rename
        </button>
      </div>
      <p
        aria-live="polite"
        className={cn(
          'flex min-h-4 items-center gap-1 text-[12px]',
          status === 'error'
            ? 'text-signal-rose'
            : 'text-vault-700 dark:text-vault-300'
        )}
      >
        {status === 'saved' && (
          <>
            <Check className="size-3.5" aria-hidden="true" /> Renamed
          </>
        )}
        {status === 'error' && 'Rename failed. You may not have permission.'}
      </p>
    </form>
  );
};

export default ShareRenameForm;
