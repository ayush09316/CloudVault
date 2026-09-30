import Link from 'next/link';
import Image from 'next/image';
import {
  FolderTree,
  Trash2,
  Share2,
  Eye,
  CheckSquare,
  Gauge,
  History,
  ArrowRight,
  FileText,
  ImageIcon,
  Video,
  File as FileIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

const features = [
  {
    icon: FolderTree,
    title: 'Real folders',
    description:
      'Organize files into nested folders instead of one flat bucket — move, rename and browse them like a real filesystem.',
  },
  {
    icon: Trash2,
    title: 'Trash & restore',
    description:
      'Deleted something by mistake? Every file and folder goes to trash first, and comes back exactly where it was.',
  },
  {
    icon: Share2,
    title: 'Granular sharing',
    description:
      'Share a file or folder with view or edit access, and set links to expire automatically when you no longer need them open.',
  },
  {
    icon: Eye,
    title: 'In-app previews',
    description:
      'Open images, PDFs and documents right in the browser — no download round-trip just to check a file.',
  },
  {
    icon: CheckSquare,
    title: 'Bulk operations',
    description:
      'Select multiple files to move, zip and download, or send to trash together instead of one at a time.',
  },
  {
    icon: Gauge,
    title: 'Enforced quotas',
    description:
      'Storage limits are tracked per account and enforced on upload, with a live usage breakdown by file type.',
  },
];

const mockFiles = [
  {
    icon: FileText,
    name: 'Q3-roadmap.pdf',
    size: '2.4 MB',
    color: 'text-signal-rose',
  },
  {
    icon: ImageIcon,
    name: 'hero-shot.png',
    size: '1.1 MB',
    color: 'text-vault-500',
  },
  {
    icon: Video,
    name: 'demo-walkthrough.mp4',
    size: '48 MB',
    color: 'text-blue',
  },
  {
    icon: FileIcon,
    name: 'contract-v2.docx',
    size: '312 KB',
    color: 'text-orange',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="container flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo-brand.svg"
            alt="CloudVault"
            width={32}
            height={32}
          />
          <span className="font-display text-lg font-bold">CloudVault</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-vault-600 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
          >
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="container grid gap-12 pb-20 pt-10 lg:grid-cols-2 lg:items-center lg:pt-16">
        <div className="flex animate-fade-up flex-col gap-6">
          <span className="w-fit rounded-full bg-vault-600/10 px-4 py-1.5 text-body-sm font-medium text-vault-700 dark:bg-vault-400/10 dark:text-vault-300">
            File storage that behaves like it should
          </span>
          <h1 className="font-display text-display-sm lg:text-display">
            Your files,{' '}
            <span className="text-vault-600 dark:text-vault-300">
              actually organized.
            </span>
          </h1>
          <p className="max-w-xl text-body-lg text-muted-foreground">
            CloudVault is a storage workspace with real folders, a working
            trash, granular sharing and instant previews — the basics every
            other storage tool somehow gets wrong.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-vault-600 px-8 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
            >
              <Link href="/sign-up">
                Create your vault
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-signal-rose/70" />
                <span className="size-2.5 rounded-full bg-signal-amber/70" />
                <span className="size-2.5 rounded-full bg-vault-500/70" />
              </div>
              <span className="text-caption text-muted-foreground">
                My Files
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {mockFiles.map((f) => (
                <div
                  key={f.name}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <f.icon className={`size-6 ${f.color}`} aria-hidden="true" />
                  <div>
                    <p className="line-clamp-1 text-body-sm font-medium">
                      {f.name}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {f.size}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-vault-600/5 p-3 dark:bg-vault-400/10">
              <div className="mb-1.5 flex items-center justify-between text-caption text-muted-foreground">
                <span>Storage used</span>
                <span>6.4 GB of 15 GB</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full w-[43%] rounded-full bg-vault-600 dark:bg-vault-400" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rounded-xl border border-border bg-card p-3 shadow-soft sm:block">
            <div className="flex items-center gap-2 text-body-sm">
              <History className="size-4 text-vault-600 dark:text-vault-300" />
              <span>Priya shared &ldquo;Q3-roadmap.pdf&rdquo;</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="h2 font-display">
              Everything a storage tool needs, nothing it doesn&apos;t
            </h2>
            <p className="mt-3 text-body-lg text-muted-foreground">
              Built for teams that need more than a flat list of uploads.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-vault-600/10 text-vault-600 dark:bg-vault-400/10 dark:text-vault-300">
                  <f.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="h4 font-display">{f.title}</h3>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 text-center">
        <h2 className="h2 font-display">Bring order to your files today</h2>
        <p className="mx-auto mt-3 max-w-xl text-body-lg text-muted-foreground">
          Sign up in seconds — no card required to start.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-vault-600 px-8 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
          >
            <Link href="/sign-up">
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-caption text-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} CloudVault</span>
          <span>Built for teams who actually organize their files.</span>
        </div>
      </footer>
    </main>
  );
}
