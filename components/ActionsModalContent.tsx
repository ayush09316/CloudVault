'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {
  Check,
  ChevronDown,
  Copy,
  Globe,
  Link2,
  Loader2,
  Lock,
  Plus,
  Trash2,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileThumb } from '@/components/Thumbnail';
import ShareAvatar from '@/components/ShareAvatar';
import FileTooltip, { FileTooltipProvider } from '@/components/FileTooltip';
import { PreviewActivity, PreviewMeta } from '@/components/PreviewDetails';
import {
  menuContentClass,
  menuItemClass,
  menuItemDangerClass,
  menuSeparatorClass,
} from '@/components/ActionDropdown';
import { formatFullDate, formatShortDate } from '@/components/FileFormat';
import {
  addShareGrantees,
  createShareLink,
  revokeShare,
} from '@/lib/actions/share.actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { FileDocument, ShareDocument } from '@/types';

export const FileDetails = ({ file }: { file: FileDocument }) => {
  const [tab, setTab] = useState<'details' | 'activity'>('details');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-ink-50/60 p-2.5 dark:bg-ink-950/40">
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
          <FileThumb file={file} className="size-10" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium text-foreground">
            {file.name}
          </p>
          <p className="fx-num text-[12px] text-muted-foreground">
            Modified {formatShortDate(file.$updatedAt)}
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="File information"
        className="inline-flex w-fit rounded-lg bg-ink-100 p-0.5 dark:bg-ink-800"
      >
        {(['details', 'activity'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`tab-${t}-${file.$id}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}-${file.$id}`}
            onClick={() => setTab(t)}
            className={cn(
              'fx-focus h-7 rounded-md px-3 text-[12.5px] font-medium capitalize transition-colors',
              tab === t
                ? 'bg-card text-foreground shadow-[0_1px_2px_rgba(10,13,12,0.08)] dark:bg-ink-700'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}-${file.$id}`}
        aria-labelledby={`tab-${tab}-${file.$id}`}
        className="min-h-[180px]"
      >
        {tab === 'details' ? (
          <PreviewMeta file={file} />
        ) : (
          <div className="max-h-80 overflow-y-auto pr-1">
            <PreviewActivity fileId={file.$id} />
          </div>
        )}
      </div>
    </div>
  );
};

const EXPIRY_OPTIONS = [
  { label: 'Never expires', value: '0' },
  { label: 'Expires in 1 day', value: '1' },
  { label: 'Expires in 7 days', value: '7' },
  { label: 'Expires in 30 days', value: '30' },
  { label: 'Custom date…', value: 'custom' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_LABEL = { view: 'Viewer', edit: 'Editor' } as const;
const LINK_ROLE_LABEL = { view: 'Can view', edit: 'Can edit' } as const;

const todayPlus = (days: number) => {
  const d = new Date(Date.now() + days * 86400000);
  return d.toISOString().slice(0, 10);
};

const copyText = async (text: string, fallback?: HTMLInputElement | null) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (fallback) {
      fallback.select();
      return document.execCommand('copy');
    }
    return false;
  }
};

const SectionTitle = ({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
}) => (
  <div className="mb-1.5 flex items-center justify-between">
    <h3 className="text-[12.5px] font-semibold text-foreground">{children}</h3>
    {aside}
  </div>
);

const RoleMenu = ({
  role,
  email,
  disabled,
  onChange,
  onRemove,
}: {
  role: 'view' | 'edit';
  email: string;
  disabled?: boolean;
  onChange: (role: 'view' | 'edit') => void;
  onRemove: () => void;
}) => (
  <DropdownMenuPrimitive.Root modal={false}>
    <DropdownMenuPrimitive.Trigger
      disabled={disabled}
      aria-label={`Change access for ${email}, currently ${ROLE_LABEL[role]}`}
      className="fx-focus inline-flex h-8 items-center gap-1 rounded-md px-2 text-[13px] text-muted-foreground transition-colors hover:bg-ink-100 hover:text-foreground disabled:opacity-50 data-[state=open]:bg-ink-100 data-[state=open]:text-foreground dark:hover:bg-ink-800 dark:data-[state=open]:bg-ink-800"
    >
      {ROLE_LABEL[role]}
      <ChevronDown className="size-3.5" aria-hidden="true" />
    </DropdownMenuPrimitive.Trigger>
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align="end"
        sideOffset={4}
        className={cn(menuContentClass, 'z-[70] min-w-[200px]')}
      >
        {(['view', 'edit'] as const).map((r) => (
          <DropdownMenuPrimitive.Item
            key={r}
            className={cn(menuItemClass, 'h-auto items-start py-1.5')}
            onSelect={() => r !== role && onChange(r)}
          >
            <Check
              aria-hidden="true"
              className={cn('mt-0.5', r === role ? 'opacity-100' : 'opacity-0')}
            />
            <span className="flex flex-col">
              <span>{ROLE_LABEL[r]}</span>
              <span className="text-[11.5px] text-muted-foreground">
                {r === 'view' ? 'Can open and download' : 'Can also rename'}
              </span>
            </span>
          </DropdownMenuPrimitive.Item>
        ))}
        <DropdownMenuPrimitive.Separator className={menuSeparatorClass} />
        <DropdownMenuPrimitive.Item
          className={menuItemDangerClass}
          onSelect={onRemove}
        >
          <UserMinus aria-hidden="true" />
          Remove access
        </DropdownMenuPrimitive.Item>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  </DropdownMenuPrimitive.Root>
);

export const ShareInput = ({
  file,
  onDone,
}: {
  file: FileDocument;
  onDone?: () => void;
}) => {
  const path = usePathname();
  const { toast } = useToast();
  const [shares, setShares] = useState<ShareDocument[] | null>(null);
  const [emails, setEmails] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [role, setRole] = useState<'view' | 'edit'>('view');
  const [linkRole, setLinkRole] = useState<'view' | 'edit'>('view');
  const [expiry, setExpiry] = useState('0');
  const [customDate, setCustomDate] = useState(todayPlus(14));
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<number | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fail = (description: string) =>
    toast({ description, className: 'error-toast' });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/files/${file.$id}/shares`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(String(res.status));
      setShares((await res.json()) as ShareDocument[]);
    } catch {
      setShares([]);
      fail('Couldn’t load sharing settings.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.$id]);

  useEffect(() => {
    refresh();
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, [refresh]);

  const run = async (
    key: string,
    fn: () => Promise<unknown>,
    failure: string
  ) => {
    setBusy(key);
    try {
      await fn();
      await refresh();
      return true;
    } catch {
      fail(failure);
      return false;
    } finally {
      setBusy(null);
    }
  };

  const linkFor = (token: string) => `${window.location.origin}/share/${token}`;
  const grants = (shares ?? []).filter((s) => s.granteeEmail);
  const links = (shares ?? []).filter((s) => s.token);
  const linkOn = links.length > 0;

  const expiresInDays = () => {
    if (expiry === 'custom') {
      const ms = new Date(`${customDate}T23:59:59`).getTime() - Date.now();
      return Math.max(1, Math.ceil(ms / 86400000));
    }
    return Number(expiry) || null;
  };

  const invite = async () => {
    const list = emails
      .split(/[\s,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (list.length === 0) return;
    const bad = list.filter((e) => !EMAIL_RE.test(e));
    if (bad.length) {
      setEmailError(
        `${bad.join(', ')} ${bad.length === 1 ? 'isn’t a valid email' : 'aren’t valid emails'}.`
      );
      return;
    }
    setEmailError(null);
    const ok = await run(
      'invite',
      () => addShareGrantees({ fileId: file.$id, emails: list, role, path }),
      'Failed to share file.'
    );
    if (ok) {
      setEmails('');
      toast({
        description: `Shared with ${list.length === 1 ? list[0] : `${list.length} people`}.`,
      });
    }
  };

  const markCopied = (id: string) => {
    setCopied(id);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(null), 1800);
  };

  const createLink = () =>
    run(
      'link',
      () =>
        createShareLink({
          fileId: file.$id,
          role: linkRole,
          expiresInDays: expiresInDays(),
          path,
        }),
      'Failed to create link.'
    );

  const toggleLink = async () => {
    if (linkOn) {
      await run(
        'link',
        async () => {
          for (const s of links) await revokeShare({ shareId: s.$id, path });
        },
        'Failed to turn off link sharing.'
      );
    } else {
      await createLink();
    }
  };

  const copyPrimary = async () => {
    let share = links[0];
    if (!share) {
      setBusy('copy');
      try {
        share = await createShareLink({
          fileId: file.$id,
          role: linkRole,
          expiresInDays: expiresInDays(),
          path,
        });
        await refresh();
      } catch {
        setBusy(null);
        return fail('Failed to create link.');
      }
      setBusy(null);
    }
    if (share?.token && (await copyText(linkFor(share.token))))
      markCopied('footer');
  };

  const ownerName = (file.owner?.fullName as string) || 'Owner';
  const ownerEmail = file.owner?.email as string | undefined;
  const loading = shares === null;

  return (
    <FileTooltipProvider>
      <div className="flex flex-col">
        <div className="px-5 pb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              invite();
            }}
            className="flex gap-2"
          >
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Add people by email</span>
              <UserPlus
                aria-hidden="true"
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                inputMode="email"
                autoComplete="off"
                autoFocus
                placeholder="Add people by email"
                value={emails}
                aria-invalid={!!emailError}
                aria-describedby={
                  emailError ? `share-err-${file.$id}` : undefined
                }
                onChange={(e) => {
                  setEmails(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                className={cn(
                  'fx-input pl-8',
                  emailError &&
                    '!border-signal-rose focus-visible:!ring-signal-rose/15'
                )}
              />
            </label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as 'view' | 'edit')}
            >
              <SelectTrigger
                className="h-9 w-auto min-w-[112px] shrink-0 gap-2 whitespace-nowrap text-[13px]"
                aria-label="Role for new people"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[70]">
                <SelectItem value="view">Viewer</SelectItem>
                <SelectItem value="edit">Editor</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="submit"
              className="fx-btn fx-btn-primary shrink-0"
              disabled={!emails.trim() || busy === 'invite'}
            >
              {busy === 'invite' && (
                <Loader2 className="animate-spin" aria-hidden="true" />
              )}
              Invite
            </button>
          </form>
          {emailError && (
            <p
              id={`share-err-${file.$id}`}
              role="alert"
              className="mt-1.5 text-[12px] text-signal-rose"
            >
              {emailError}
            </p>
          )}

          <div className="mt-5">
            <SectionTitle
              aside={
                !loading && (
                  <span className="fx-num text-[12px] text-muted-foreground">
                    {grants.length + 1}{' '}
                    {grants.length === 0 ? 'person' : 'people'}
                  </span>
                )
              }
            >
              People with access
            </SectionTitle>
            <ul className="-mx-2 max-h-56 overflow-y-auto">
              <li className="flex items-center gap-3 rounded-md px-2 py-1.5">
                <ShareAvatar name={ownerName} seed={ownerEmail} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-foreground">
                    {ownerName}{' '}
                    <span className="font-normal text-muted-foreground">
                      (you)
                    </span>
                  </p>
                  {ownerEmail && (
                    <p className="truncate text-[12px] text-muted-foreground">
                      {ownerEmail}
                    </p>
                  )}
                </div>
                <span className="px-2 text-[13px] text-muted-foreground">
                  Owner
                </span>
              </li>
              {loading &&
                [0, 1].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 px-2 py-1.5"
                    aria-hidden="true"
                  >
                    <span className="fx-skeleton size-9 rounded-full" />
                    <span className="flex-1 space-y-1.5">
                      <span className="fx-skeleton block h-3 w-1/2" />
                      <span className="fx-skeleton block h-2.5 w-1/3" />
                    </span>
                  </li>
                ))}
              {grants.map((s) => (
                <li
                  key={s.$id}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-ink-50 dark:hover:bg-ink-800/50"
                >
                  <ShareAvatar name={s.granteeEmail} seed={s.granteeEmail} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] text-foreground">
                      {s.granteeEmail}
                    </p>
                  </div>
                  <RoleMenu
                    role={s.role}
                    email={s.granteeEmail!}
                    disabled={busy === s.$id}
                    onChange={(r) =>
                      run(
                        s.$id,
                        () =>
                          addShareGrantees({
                            fileId: file.$id,
                            emails: [s.granteeEmail!],
                            role: r,
                            path,
                          }),
                        'Failed to change access.'
                      )
                    }
                    onRemove={() =>
                      run(
                        s.$id,
                        () => revokeShare({ shareId: s.$id, path }),
                        'Failed to remove access.'
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border px-5 py-4">
          <SectionTitle>General access</SectionTitle>
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className={cn(
                'mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                linkOn
                  ? 'bg-vault-600/10 text-vault-700 dark:bg-vault-400/15 dark:text-vault-300'
                  : 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-300'
              )}
            >
              {linkOn ? (
                <Globe className="size-4" />
              ) : (
                <Lock className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor={`link-switch-${file.$id}`}
                  className="cursor-pointer text-[13.5px] font-medium text-foreground"
                >
                  Anyone with the link
                </label>
                <button
                  id={`link-switch-${file.$id}`}
                  type="button"
                  role="switch"
                  aria-checked={linkOn}
                  data-testid="create-share-link"
                  disabled={loading || busy === 'link'}
                  onClick={toggleLink}
                  className="fx-switch"
                >
                  <span />
                </button>
              </div>
              <p className="text-[12.5px] leading-5 text-muted-foreground">
                {linkOn
                  ? 'Anyone on the internet with a link below can open this file. No sign-in needed.'
                  : 'Restricted. Only people with access can open this file.'}
              </p>

              {!linkOn && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Select
                    value={linkRole}
                    onValueChange={(v) => setLinkRole(v as 'view' | 'edit')}
                  >
                    <SelectTrigger
                      className="h-9 w-auto min-w-[124px] gap-2 whitespace-nowrap text-[13px]"
                      aria-label="Link permission"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[70]">
                      <SelectItem value="view">Can view</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={expiry} onValueChange={setExpiry}>
                    <SelectTrigger
                      className="h-9 w-auto min-w-[172px] gap-2 whitespace-nowrap text-[13px]"
                      aria-label="Link expiry"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[70]">
                      {EXPIRY_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {expiry === 'custom' && (
                    <input
                      type="date"
                      aria-label="Expiry date"
                      value={customDate}
                      min={todayPlus(1)}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="fx-input fx-num h-9 w-[150px] px-2 text-[13px]"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {linkOn && (
            <ul className="mt-3 space-y-2">
              {links.map((s) => {
                const url = linkFor(s.token!);
                const isCopied = copied === s.$id;
                return (
                  <li
                    key={s.$id}
                    className="rounded-lg border border-border bg-ink-50/60 p-2 dark:bg-ink-950/40"
                  >
                    <div className="flex items-center gap-2">
                      <Link2
                        aria-hidden="true"
                        className="ml-1 size-4 shrink-0 text-muted-foreground"
                      />
                      <input
                        readOnly
                        ref={(el) => {
                          inputRefs.current[s.$id] = el;
                        }}
                        value={url}
                        aria-label="Share link"
                        data-testid="share-link-url"
                        onFocus={(e) => e.currentTarget.select()}
                        className="fx-num min-w-0 flex-1 truncate bg-transparent text-[12.5px] text-foreground outline-none"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (await copyText(url, inputRefs.current[s.$id]))
                            markCopied(s.$id);
                        }}
                        className={cn(
                          'fx-btn fx-btn-secondary fx-btn-sm min-w-[76px]',
                          isCopied &&
                            '!border-vault-600/40 !text-vault-700 dark:!text-vault-300'
                        )}
                      >
                        {isCopied ? (
                          <Check aria-hidden="true" />
                        ) : (
                          <Copy aria-hidden="true" />
                        )}
                        <span aria-live="polite">
                          {isCopied ? 'Copied' : 'Copy'}
                        </span>
                      </button>
                      <FileTooltip label="Revoke link">
                        <button
                          type="button"
                          aria-label="Revoke link"
                          disabled={busy === s.$id}
                          onClick={() =>
                            run(
                              s.$id,
                              () => revokeShare({ shareId: s.$id, path }),
                              'Failed to revoke link.'
                            )
                          }
                          className="fx-icon-btn hover:!bg-signal-rose/10 hover:!text-signal-rose"
                        >
                          {busy === s.$id ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 />
                          )}
                        </button>
                      </FileTooltip>
                    </div>
                    <p className="fx-num mt-1 pl-7 text-[11.5px] text-muted-foreground">
                      {LINK_ROLE_LABEL[s.role]}
                      <span aria-hidden="true" className="mx-1.5">
                        ·
                      </span>
                      {s.expiresAt ? (
                        <time
                          dateTime={s.expiresAt}
                          title={formatFullDate(s.expiresAt)}
                        >
                          Expires {formatShortDate(s.expiresAt)}
                        </time>
                      ) : (
                        'Never expires'
                      )}
                    </p>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={createLink}
                  disabled={busy === 'link'}
                  className="fx-btn fx-btn-ghost fx-btn-sm -ml-1"
                >
                  {busy === 'link' ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Plus aria-hidden="true" />
                  )}
                  Create another link
                </button>
              </li>
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border bg-ink-50/70 px-5 py-3 dark:bg-ink-950/40">
          <button
            type="button"
            onClick={copyPrimary}
            disabled={loading || busy === 'copy'}
            className={cn(
              'fx-btn fx-btn-secondary min-w-[112px]',
              copied === 'footer' &&
                '!border-vault-600/40 !text-vault-700 dark:!text-vault-300'
            )}
          >
            {busy === 'copy' ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : copied === 'footer' ? (
              <Check aria-hidden="true" />
            ) : (
              <Link2 aria-hidden="true" />
            )}
            <span aria-live="polite">
              {copied === 'footer' ? 'Link copied' : 'Copy link'}
            </span>
          </button>
          <button
            type="button"
            onClick={onDone}
            className="fx-btn fx-btn-primary min-w-[72px]"
          >
            Done
          </button>
        </div>
      </div>
    </FileTooltipProvider>
  );
};
