import Crosses from './Crosses';
import Link from 'next/link';
import { Brand } from './Nav';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#security', label: 'Permissions' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/sign-up', label: 'Create a vault' },
      { href: '/sign-in', label: 'Sign in' },
    ],
  },
];

const Footer = () => (
  <footer className="cvl-hr">
    <Crosses />
    <div className="grid gap-10 px-5 py-14 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr]">
      <div className="space-y-4">
        <Brand />
        <p className="max-w-xs text-[13.5px] leading-relaxed text-muted-foreground">
          File storage with real folders, a recoverable trash and sharing that
          is checked on every request.
        </p>
      </div>
      {COLUMNS.map((c) => (
        <div key={c.title}>
          <p className="cvl-eyebrow">{c.title}</p>
          <ul className="mt-4 space-y-2.5">
            {c.links.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="cvl-mono flex flex-col gap-2 border-t border-border p-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
      <span>© {new Date().getFullYear()} CloudVault</span>
      <span>Built on Next.js and Appwrite</span>
    </div>
  </footer>
);

export default Footer;
