import Link from 'next/link';
import { Crumb } from '@/lib/folders';

const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="mb-3" data-testid="breadcrumbs">
    <ol className="body-2 flex flex-wrap items-center gap-1 text-light-200">
      {crumbs.map((crumb, i) => {
        const last = i === crumbs.length - 1;
        return (
          <li key={crumb.id ?? 'root'} className="flex items-center gap-1">
            {last ? (
              <span className="text-light-100">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.id ? `/files?folder=${crumb.id}` : '/files'}
                className="hover:text-brand"
              >
                {crumb.name}
              </Link>
            )}
            {!last && <span>/</span>}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
