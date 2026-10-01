import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { listUsersWithUsage } from '@/lib/actions/admin.actions';
import UserDisableToggle from '@/components/UserDisableToggle';
import { cn, convertFileSize } from '@/lib/utils';
import { usagePercentage } from '@/lib/quota';
import { initials } from '@/components/ShellConstants';
import { formatPct } from '@/components/ShellStorageMeter';

const Stat = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => (
  <div className="flex flex-col gap-1 px-5 py-4">
    <dt className="text-caption text-ink-500 dark:text-ink-400">{label}</dt>
    <dd className="font-display text-h3 font-semibold tabular-nums tracking-[-0.02em] text-ink-900 dark:text-ink-50">
      {value}
      {sub && (
        <span className="ml-1.5 text-body-sm font-normal tracking-normal text-ink-400">
          {sub}
        </span>
      )}
    </dd>
  </div>
);

const Page = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.isAdmin) redirect('/dashboard');

  const users = await listUsersWithUsage();
  const active = users.filter((u) => !u.disabled).length;
  const totalBytes = users.reduce((n, u) => n + u.usedBytes, 0);
  const totalFiles = users.reduce((n, u) => n + u.fileCount, 0);
  const nearQuota = users.filter(
    (u) => usagePercentage(u.usedBytes, u.quotaBytes) >= 85
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <header className="shell-rise flex flex-col gap-1">
        <h1 className="font-display text-h2 tracking-[-0.02em] text-ink-900 dark:text-ink-50">
          Users
        </h1>
        <p className="text-body-sm text-ink-500 dark:text-ink-400">
          Manage access and keep an eye on storage across every account.
        </p>
      </header>

      <dl
        className="shell-panel shell-rise grid grid-cols-2 divide-border overflow-hidden sm:grid-cols-4 sm:divide-x [&>*:nth-child(even)]:border-l [&>*:nth-child(even)]:border-border [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-border sm:[&>*:nth-child(n+3)]:border-t-0"
        style={{ ['--i' as string]: 1 }}
      >
        <Stat label="Members" value={String(users.length)} />
        <Stat label="Active" value={String(active)} sub={`/ ${users.length}`} />
        <Stat
          label="Stored"
          value={convertFileSize(totalBytes)}
          sub={`${totalFiles.toLocaleString('en')} files`}
        />
        <Stat label="Near quota" value={String(nearQuota)} sub="≥ 85%" />
      </dl>

      <div
        className="shell-panel shell-rise overflow-hidden"
        style={{ ['--i' as string]: 2 }}
      >
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-[720px] text-left text-body-sm"
            data-testid="users-table"
          >
            <thead>
              <tr className="border-b border-border text-caption text-ink-500 dark:text-ink-400">
                <th scope="col" className="px-5 py-2.5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Files
                </th>
                <th scope="col" className="w-[30%] px-3 py-2.5 font-medium">
                  Usage
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-2.5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => {
                const pct = usagePercentage(u.usedBytes, u.quotaBytes);
                const near = pct >= 85;
                return (
                  <tr
                    key={u.$id}
                    className={cn(
                      'transition-colors hover:bg-ink-900/[0.02] dark:hover:bg-white/[0.02]',
                      u.disabled && 'text-ink-400'
                    )}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-900/[0.06] text-[11px] font-semibold text-ink-700 dark:bg-white/[0.08] dark:text-ink-200"
                        >
                          {initials(u.fullName)}
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2">
                            <span
                              className="truncate font-medium capitalize text-ink-900 dark:text-ink-50"
                              title={u.fullName}
                            >
                              {u.fullName}
                            </span>
                            {u.isAdmin && (
                              <span className="rounded border border-vault-600/25 px-1 py-px text-[10px] font-medium uppercase tracking-[0.06em] text-vault-700 dark:border-vault-400/25 dark:text-vault-300">
                                admin
                              </span>
                            )}
                            {u.$id === currentUser.$id && (
                              <span className="text-caption text-ink-400">
                                you
                              </span>
                            )}
                          </p>
                          <p
                            className="max-w-[260px] truncate text-caption text-ink-500 dark:text-ink-400"
                            title={u.email}
                          >
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right tabular-nums">
                      {u.fileCount.toLocaleString('en')}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div
                          role="img"
                          aria-label={`${formatPct(pct)}% of quota used`}
                          className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-ink-900/[0.06] dark:bg-white/[0.07]"
                        >
                          <div
                            className={cn(
                              'shell-grow-x h-full rounded-full',
                              near
                                ? 'bg-signal-amber'
                                : 'bg-vault-600 dark:bg-vault-400'
                            )}
                            style={{
                              width: `${Math.max(pct, pct > 0 ? 2 : 0)}%`,
                            }}
                          />
                        </div>
                        <span
                          className="whitespace-nowrap text-caption tabular-nums text-ink-500 dark:text-ink-400"
                          title={`${convertFileSize(u.usedBytes)} of ${convertFileSize(u.quotaBytes)}`}
                        >
                          {convertFileSize(u.usedBytes)}
                          <span className="text-ink-300 dark:text-ink-600">
                            {' '}
                            / {convertFileSize(u.quotaBytes)}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-caption',
                          u.disabled
                            ? 'border-border text-ink-500 dark:text-ink-400'
                            : 'border-vault-600/20 text-vault-700 dark:border-vault-400/20 dark:text-vault-300'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'size-1.5 rounded-full',
                            u.disabled
                              ? 'bg-ink-300 dark:bg-ink-600'
                              : 'bg-vault-500'
                          )}
                        />
                        {u.disabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.$id !== currentUser.$id && (
                        <UserDisableToggle
                          userId={u.$id}
                          disabled={u.disabled}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
