import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.actions';
import { getUsageSummary } from '@/lib/utils';
import DashboardContent from '@/components/Dashboard';

const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ]);

  const usageSummary = getUsageSummary(totalSpace);

  return (
    <DashboardContent
      files={files}
      totalSpace={totalSpace}
      usageSummary={usageSummary}
    />
  );
};

export default Dashboard;
