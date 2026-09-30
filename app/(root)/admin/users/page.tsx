import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { listUsersWithUsage } from '@/lib/actions/admin.actions';
import UserDisableToggle from '@/components/UserDisableToggle';
import { convertFileSize } from '@/lib/utils';
import { usagePercentage } from '@/lib/quota';

const Page = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.isAdmin) redirect('/');

  const users = await listUsersWithUsage();

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1">Users</h1>
        <p className="body-1 mt-2 text-light-200">{users.length} users</p>
      </section>

      <div className="w-full overflow-x-auto rounded-2xl bg-white p-4">
        <table className="body-2 w-full text-left" data-testid="users-table">
          <thead className="text-light-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Files</th>
              <th className="p-2">Usage</th>
              <th className="p-2">Status</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.$id} className="border-t border-light-400">
                <td className="p-2">
                  {u.fullName}
                  {u.isAdmin && (
                    <span className="caption ml-2 text-brand">admin</span>
                  )}
                </td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.fileCount}</td>
                <td className="p-2">
                  {convertFileSize(u.usedBytes)} /{' '}
                  {convertFileSize(u.quotaBytes)} (
                  {usagePercentage(u.usedBytes, u.quotaBytes)}%)
                </td>
                <td className="p-2">{u.disabled ? 'Disabled' : 'Active'}</td>
                <td className="p-2">
                  {u.$id !== currentUser.$id && (
                    <UserDisableToggle userId={u.$id} disabled={u.disabled} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
