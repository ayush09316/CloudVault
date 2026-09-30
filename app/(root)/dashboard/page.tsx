import {
  getFiles,
  getRecentActivityForCurrentUser,
  getTotalSpaceUsed,
} from '@/lib/actions/file.actions';
import { getUsageSummary } from '@/lib/utils';
import DashboardContent from '@/components/Dashboard';

const Dashboard = async () => {
  const [files, totalSpace, activity] = await Promise.all([
    getFiles({ types: [], limit: 8 }),
    getTotalSpaceUsed(),
    getRecentActivityForCurrentUser(8),
  ]);

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <DashboardContent
      files={files ?? { documents: [] }}
      totalSpace={totalSpace}
      usageSummary={usageSummary}
      activity={activity}
    />
  );
};

export default Dashboard;
