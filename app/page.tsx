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
  ShieldCheck,
  KeyRound,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import Reveal from '@/components/Reveal';
import SpotlightCard from '@/components/SpotlightCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProductPreviewStack from '@/components/landing/ProductPreviewStack';

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

const securityPoints = [
  {
    icon: KeyRound,
    title: 'Role-aware sharing',
    description:
      'Every share link carries a view or edit role that the server enforces on each request — not just in the UI.',
  },
  {
    icon: Lock,
    title: 'Expiring links',
    description:
      'Set a link to expire after a few days and it stops resolving automatically, no manual cleanup required.',
  },
  {
    icon: ShieldCheck,
    title: 'Ownership checks everywhere',
    description:
      'Rename, delete and share actions all verify you own (or were granted) the file before touching it.',
  },
];

const faqs = [
  {
    q: 'Does CloudVault support nested folders?',
    a: 'Yes — folders can contain other folders, and moving a folder brings everything inside it along.',
  },
  {
    q: 'What happens when I delete a file?',
    a: 'It moves to Trash first. Nothing is permanently deleted until you explicitly empty the trash or delete it forever from there.',
  },
  {
    q: 'Can I control who sees a shared file?',
    a: 'Each share link is scoped to view-only or edit access, and you can set it to expire after a chosen number of days.',
  },
  {
    q: 'Is there a storage limit?',
    a: 'Yes, every account has a quota that is enforced on upload — the dashboard shows exactly how much you have used, by category.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-background text-foreground">
      <header className="container relative z-10 flex items-center justify-between py-6">
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
            className="cv-btn-shine rounded-full bg-vault-600 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
          >
            <Link href="/sign-up">
              <span className="shine" aria-hidden="true" />
              Get started
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative">
        <div className="cv-aurora" aria-hidden="true">
          <span className="a" />
          <span className="b" />
          <span className="c" />
        </div>
        <div className="cv-dots absolute inset-0" aria-hidden="true" />

        <div className="container relative z-10 grid gap-12 pb-24 pt-10 lg:grid-cols-2 lg:items-center lg:pt-16">
          <div className="cv-reveal is-in flex flex-col gap-6">
            <span className="w-fit rounded-full bg-vault-600/10 px-4 py-1.5 text-body-sm font-medium text-vault-700 dark:bg-vault-400/10 dark:text-vault-300">
              File storage that behaves like it should
            </span>
            <h1 className="font-display text-display-sm lg:text-display">
              Your files,{' '}
              <span className="bg-gradient-to-r from-vault-600 via-vault-500 to-signal-amber bg-clip-text text-transparent dark:from-vault-300 dark:via-vault-400 dark:to-signal-amber">
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
                className="cv-btn-shine rounded-full bg-vault-600 px-8 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
              >
                <Link href="/sign-up">
                  <span className="shine" aria-hidden="true" />
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

            <dl className="mt-4 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <div>
                <dt className="text-caption text-muted-foreground">Uptime</dt>
                <dd className="font-display text-2xl font-bold">
                  <AnimatedCounter value={99.9} decimals={1} suffix="%" />
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  Share roles
                </dt>
                <dd className="font-display text-2xl font-bold">
                  <AnimatedCounter value={2} />
                </dd>
              </div>
              <div>
                <dt className="text-caption text-muted-foreground">
                  Notification channels
                </dt>
                <dd className="font-display text-2xl font-bold">
                  <AnimatedCounter value={0} suffix="-click" />
                </dd>
              </div>
            </dl>
          </div>

          <Reveal delay={120} className="relative">
            <ProductPreviewStack />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="container py-16">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="h2 font-display">
              Everything a storage tool needs, nothing it doesn&apos;t
            </h2>
            <p className="mt-3 text-body-lg text-muted-foreground">
              Built for teams that need more than a flat list of uploads.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <SpotlightCard className="cv-lift h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-vault-600/10 text-vault-600 dark:bg-vault-400/10 dark:text-vault-300">
                    <f.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="h4 font-display">{f.title}</h3>
                  <p className="mt-2 text-body-sm text-muted-foreground">
                    {f.description}
                  </p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="h2 font-display">
            Permissions that are actually enforced
          </h2>
          <p className="mt-3 text-body-lg text-muted-foreground">
            Sharing looks simple from the outside. Underneath, every action is
            checked server-side.
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-3">
          {securityPoints.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="cv-lift h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-vault-600/10 text-vault-600 dark:bg-vault-400/10 dark:text-vault-300">
                  <s.icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="h4 font-display">{s.title}</h3>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="container py-20">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="h2 font-display">Frequently asked</h2>
          </Reveal>
          <div className="mx-auto max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
            {faqs.map((item) => (
              <details key={item.q} className="group px-6 py-4">
                <summary className="body-1 flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {item.q}
                  <span className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 text-center">
        <Reveal>
          <h2 className="h2 font-display">Bring order to your files today</h2>
          <p className="mx-auto mt-3 max-w-xl text-body-lg text-muted-foreground">
            Sign up in seconds — no card required to start.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="cv-btn-shine rounded-full bg-vault-600 px-8 text-white hover:bg-vault-700 dark:bg-vault-400 dark:text-ink-950 dark:hover:bg-vault-300"
            >
              <Link href="/sign-up">
                <span className="shine" aria-hidden="true" />
                Get started free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-caption text-muted-foreground sm:flex-row">
          <span className="flex items-center gap-2">
            <History className="size-3.5" aria-hidden="true" />
            &copy; {new Date().getFullYear()} CloudVault
          </span>
          <span>Built for teams who actually organize their files.</span>
        </div>
      </footer>
    </main>
  );
}
