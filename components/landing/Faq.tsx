import Crosses from './Crosses';
import { Plus } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FAQS = [
  {
    q: 'Do I need a password?',
    a: 'No. You sign in with your email address and a six-digit code sent to it. Lost the email? Ask for a new code from the same screen.',
  },
  {
    q: 'What happens when I delete a file?',
    a: 'It moves to Trash. Restoring puts it back in the folder it came from, or at the top level if that folder no longer exists. Restoring a folder brings back everything that was trashed with it. Permanent deletion only happens when you choose it from Trash.',
  },
  {
    q: 'Can I share a whole folder?',
    a: 'Not yet. Sharing works on individual files, and only the file’s owner can share it, either with people by email or through a link.',
  },
  {
    q: 'How do expiring links work?',
    a: 'When you create a link you pick its role, view or edit, and a lifetime: never, 1 day, 7 days or 30 days. After that the link stops resolving. You can also revoke any link or person at any time.',
  },
  {
    q: 'How much can I store?',
    a: 'Each account has a 2 GB quota by default, and a single file can be up to 50 MB. The dashboard shows what you have used, split by documents, images, media and everything else.',
  },
  {
    q: 'Which files can I preview?',
    a: 'Images (JPG, PNG, GIF, WebP, BMP, SVG), PDFs, video (MP4, WebM, MOV) and audio (MP3, WAV, OGG, FLAC) open in the browser. Anything else downloads with one click.',
  },
];

const Faq = () => (
  <section id="faq" aria-labelledby="faq-title" className="cvl-hr scroll-mt-16">
    <Crosses />
    <div className="grid gap-12 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
      <SectionHeading
        id="faq-title"
        index="04"
        eyebrow="FAQ"
        title="Straight answers."
        className="lg:block"
      />
      <div
        data-reveal
        className="divide-y divide-border border-y border-border"
      >
        {FAQS.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium text-foreground outline-none transition-colors hover:text-foreground/80 focus-visible:text-[var(--cvl-accent)]">
              {f.q}
              <span className="cvl-faq-plus flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-[transform,border-color] duration-300 group-open:rotate-45">
                <Plus className="size-3.5" aria-hidden />
              </span>
            </summary>
            <p className="max-w-[62ch] pb-6 pr-12 text-[14px] leading-relaxed text-muted-foreground">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
