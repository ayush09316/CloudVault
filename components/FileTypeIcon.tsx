import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  LucideIcon,
  Presentation,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type FileKind =
  | 'folder'
  | 'pdf'
  | 'doc'
  | 'sheet'
  | 'slides'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'code'
  | 'other';

const EXT: Record<string, FileKind> = {
  pdf: 'pdf',
  doc: 'doc',
  docx: 'doc',
  txt: 'doc',
  rtf: 'doc',
  md: 'doc',
  odt: 'doc',
  pages: 'doc',
  xls: 'sheet',
  xlsx: 'sheet',
  csv: 'sheet',
  ods: 'sheet',
  numbers: 'sheet',
  ppt: 'slides',
  pptx: 'slides',
  key: 'slides',
  odp: 'slides',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  tar: 'archive',
  gz: 'archive',
  tgz: 'archive',
  js: 'code',
  ts: 'code',
  tsx: 'code',
  jsx: 'code',
  json: 'code',
  html: 'code',
  css: 'code',
  py: 'code',
  go: 'code',
  rs: 'code',
  java: 'code',
  sh: 'code',
  yml: 'code',
  yaml: 'code',
  xml: 'code',
  sql: 'code',
};

export const getFileKind = (
  extension: string | undefined | null,
  type: string | undefined | null
): FileKind => {
  if (type === 'folder') return 'folder';
  const ext = (extension || '').toLowerCase();
  if (EXT[ext]) return EXT[ext];
  if (type === 'image' || type === 'video' || type === 'audio') return type;
  if (type === 'document') return 'doc';
  return 'other';
};

const KINDS: Record<
  FileKind,
  { icon: LucideIcon; fg: string; bg: string; label: string }
> = {
  folder: {
    icon: Folder,
    fg: 'text-ink-500 dark:text-ink-300',
    bg: 'bg-ink-100 dark:bg-ink-800',
    label: 'Folder',
  },
  pdf: {
    icon: FileText,
    fg: 'text-[#C8443A] dark:text-[#F08A80]',
    bg: 'bg-[#C8443A]/10 dark:bg-[#F08A80]/12',
    label: 'PDF',
  },
  doc: {
    icon: FileText,
    fg: 'text-[#2F6FB5] dark:text-[#7DB3EC]',
    bg: 'bg-[#2F6FB5]/10 dark:bg-[#7DB3EC]/12',
    label: 'Document',
  },
  sheet: {
    icon: FileSpreadsheet,
    fg: 'text-[#1A8A5A] dark:text-[#5FCF9A]',
    bg: 'bg-[#1A8A5A]/10 dark:bg-[#5FCF9A]/12',
    label: 'Spreadsheet',
  },
  slides: {
    icon: Presentation,
    fg: 'text-[#C2721F] dark:text-[#F0AE62]',
    bg: 'bg-[#C2721F]/10 dark:bg-[#F0AE62]/12',
    label: 'Presentation',
  },
  image: {
    icon: FileImage,
    fg: 'text-[#B0457F] dark:text-[#EB93C4]',
    bg: 'bg-[#B0457F]/10 dark:bg-[#EB93C4]/12',
    label: 'Image',
  },
  video: {
    icon: FileVideo,
    fg: 'text-[#6A54C4] dark:text-[#A99BF0]',
    bg: 'bg-[#6A54C4]/10 dark:bg-[#A99BF0]/12',
    label: 'Video',
  },
  audio: {
    icon: FileAudio,
    fg: 'text-vault-600 dark:text-vault-300',
    bg: 'bg-vault-600/10 dark:bg-vault-300/12',
    label: 'Audio',
  },
  archive: {
    icon: FileArchive,
    fg: 'text-[#8A6A3F] dark:text-[#D2B184]',
    bg: 'bg-[#8A6A3F]/10 dark:bg-[#D2B184]/12',
    label: 'Archive',
  },
  code: {
    icon: FileCode,
    fg: 'text-[#4F5D7A] dark:text-[#A7B4CF]',
    bg: 'bg-[#4F5D7A]/10 dark:bg-[#A7B4CF]/12',
    label: 'Code',
  },
  other: {
    icon: File,
    fg: 'text-ink-500 dark:text-ink-300',
    bg: 'bg-ink-100 dark:bg-ink-800',
    label: 'File',
  },
};

export const fileKindLabel = (kind: FileKind) => KINDS[kind].label;

const SIZES = {
  xs: { box: 'size-5 rounded', icon: 'size-3' },
  sm: { box: 'size-7 rounded-md', icon: 'size-4' },
  md: { box: 'size-9 rounded-lg', icon: 'size-[18px]' },
  lg: { box: 'size-14 rounded-xl', icon: 'size-7' },
};

const FileTypeIcon = ({
  extension,
  type,
  size = 'sm',
  bare = false,
  className,
}: {
  extension?: string | null;
  type?: string | null;
  size?: keyof typeof SIZES;
  bare?: boolean;
  className?: string;
}) => {
  const kind = getFileKind(extension, type);
  const { icon: Icon, fg, bg } = KINDS[kind];
  const s = SIZES[size];

  if (bare) {
    return (
      <Icon
        aria-hidden="true"
        strokeWidth={1.75}
        className={cn(
          s.icon,
          fg,
          kind === 'folder' && 'fill-current [fill-opacity:0.14]',
          className
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        s.box,
        bg,
        fg,
        className
      )}
    >
      <Icon
        strokeWidth={1.75}
        className={cn(
          s.icon,
          kind === 'folder' && 'fill-current [fill-opacity:0.14]'
        )}
      />
    </span>
  );
};

export default FileTypeIcon;
