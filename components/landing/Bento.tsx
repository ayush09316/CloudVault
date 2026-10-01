import Crosses from './Crosses';
import {
  FolderTree,
  Trash2,
  Share2,
  Eye,
  CheckSquare,
  Gauge,
  History,
  Command,
} from 'lucide-react';
import SpotlightCard from '@/components/SpotlightCard';
import { cn } from '@/lib/utils';
import SectionHeading from './SectionHeading';
import {
  TreeDemo,
  TrashDemo,
  ShareDemo,
  PreviewDemo,
  BulkDemo,
  QuotaDemo,
  ActivityDemo,
  CommandDemo,
} from './demos';

type Tile = {
  icon: typeof FolderTree;
  title: string;
  body: string;
  demo: React.ReactNode;
  span: string;
  wide?: boolean;
};

const TILES: Tile[] = [
  {
    icon: FolderTree,
    title: 'Folders that nest',
    body: 'Create folders inside folders, move files between them and navigate by breadcrumb. Moving a folder takes everything inside it along.',
    demo: <TreeDemo />,
    span: 'lg:col-span-3',
    wide: true,
  },
  {
    icon: Trash2,
    title: 'Delete is a two-step decision',
    body: 'Everything goes to Trash first. Restore puts it back in its original folder, or at the top level if that folder is gone. Deleting forever is a separate action.',
    demo: <TrashDemo />,
    span: 'lg:col-span-3',
    wide: true,
  },
  {
    icon: Share2,
    title: 'Sharing with a role and an end date',
    body: 'Invite by email or create a link, as viewer or editor. Links can expire after a day, a week or a month.',
    demo: <ShareDemo />,
    span: 'lg:col-span-2',
  },
  {
    icon: Eye,
    title: 'Open it without downloading it',
    body: 'Images, PDFs, video and audio open in the browser, with thumbnails for common image formats.',
    demo: <PreviewDemo />,
    span: 'lg:col-span-2',
  },
  {
    icon: CheckSquare,
    title: 'Select once, act on all of it',
    body: 'Multi-select to move, trash, or download everything as a single zip.',
    demo: <BulkDemo />,
    span: 'lg:col-span-2',
  },
  {
    icon: Gauge,
    title: 'Quotas the server enforces',
    body: '2 GB per account by default. An upload that would cross the line is refused before it reaches storage, and tells you what is left.',
    demo: <QuotaDemo />,
    span: 'lg:col-span-2',
  },
  {
    icon: History,
    title: 'A record of who did what',
    body: 'Ten event types per file, from upload to revoked access, with the old name, the role and the expiry kept alongside.',
    demo: <ActivityDemo />,
    span: 'lg:col-span-2',
  },
  {
    icon: Command,
    title: 'Every view, one keystroke away',
    body: 'Press ⌘K or Ctrl K to jump between views, upload a file or create a folder.',
    demo: <CommandDemo />,
    span: 'lg:col-span-2',
  },
];

const Bento = () => (
  <section
    id="features"
    aria-labelledby="features-title"
    className="cvl-hr scroll-mt-16"
  >
    <Crosses />
    <div className="px-5 py-20 sm:px-10 sm:py-28">
      <SectionHeading
        id="features-title"
        index="01"
        eyebrow="Features"
        title="The parts of file storage that usually get skipped."
        body="Where a file goes when you delete it. Who can still open a link next month. What happens at the quota line. CloudVault is built around those details."
      />
    </div>
    <ul className="grid gap-px border-t border-border bg-border sm:grid-cols-2 lg:grid-cols-6">
      {TILES.map((t, i) => (
        <li
          key={t.title}
          data-reveal
          data-inview
          style={{ '--d': `${(i % 3) * 70}ms` } as React.CSSProperties}
          className={cn(
            'bg-background',
            t.span,
            i < 2 && 'sm:col-span-2 lg:col-span-3'
          )}
        >
          <SpotlightCard className="group flex h-full flex-col">
            <div
              className={cn(
                'relative flex items-center justify-center overflow-hidden px-6',
                t.wide ? 'min-h-[260px] py-10' : 'min-h-[230px] py-8'
              )}
            >
              <div
                aria-hidden
                className="absolute inset-0 [background-image:radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,#000,transparent)]"
              />
              <div className="relative flex w-full justify-center">
                {t.demo}
              </div>
            </div>
            <div className="mt-auto px-6 pb-7">
              <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                <t.icon className="cvl-accent size-4" aria-hidden />
                {t.title}
              </h3>
              <p className="mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-muted-foreground">
                {t.body}
              </p>
            </div>
          </SpotlightCard>
        </li>
      ))}
    </ul>
  </section>
);

export default Bento;
