'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FolderOpen, History, ArrowRight } from 'lucide-react';
import {
  convertFileSize,
  getThumbnailSrc,
  calculatePercentage,
} from '@/lib/utils';
import { FormattedDateTime } from './FormattedDateTime';
import Thumbnail from './Thumbnail';
import ActionDropdown from './ActionDropdown';
import Image from 'next/image';
import FilePreview from './FilePreview';
import EmptyState from './EmptyState';
import { ACTION_LABELS, describeActivityMeta } from '@/lib/activity';
import { ActivityEntry, FileDocument } from '@/types';

interface DashboardProps {
  files: { documents: FileDocument[] };
  totalSpace: { used: number; all: number };
  usageSummary: {
    title: string;
    size: number;
    latestDate: string;
    url: string;
    icon: string;
  }[];
  activity: ActivityEntry[];
}

const DashboardContent = ({
  files,
  totalSpace,
  usageSummary,
  activity,
}: DashboardProps) => {
  const [previewFile, setPreviewFile] = useState<FileDocument | null>(null);
  const percentage = calculatePercentage(totalSpace.used, totalSpace.all);

  return (
    <div className="bento-grid">
      {/* Storage usage */}
      <div className="bento-card flex flex-col justify-between lg:col-span-1">
        <div>
          <p className="text-vault-600 overline dark:text-vault-300">Storage</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="h1 font-display">{percentage || 0}%</span>
            <span className="body-2 mb-1 text-muted-foreground">used</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-vault-600 transition-all dark:bg-vault-400"
              style={{ width: `${Math.min(percentage || 0, 100)}%` }}
            />
          </div>
          <p className="caption mt-2 text-muted-foreground">
            {convertFileSize(totalSpace.used)} of{' '}
            {convertFileSize(totalSpace.all)}
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bento-card lg:col-span-2">
        <p className="text-vault-600 overline dark:text-vault-300">
          By category
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {usageSummary.map((summary) => (
            <Link
              href={summary.url}
              key={summary.title}
              className="group flex flex-col gap-2 rounded-xl border border-border p-3 transition-colors hover:border-vault-600/40 hover:bg-vault-600/5 dark:hover:bg-vault-400/5"
            >
              <Image
                src={summary.icon}
                width={28}
                height={28}
                alt=""
                className="opacity-90"
              />
              <div>
                <p className="subtitle-2">
                  {convertFileSize(summary.size) || '0 Bytes'}
                </p>
                <p className="caption text-muted-foreground">{summary.title}</p>
              </div>
            </Link>
          ))}
        </ul>
      </div>

      {/* Recent files */}
      <div className="bento-card lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="h4 flex items-center gap-2 font-display">
            <FolderOpen
              className="size-4 text-vault-600 dark:text-vault-300"
              aria-hidden="true"
            />
            Recent files
          </h2>
          <Link
            href="/files"
            className="body-2 flex items-center gap-1 text-vault-600 hover:underline dark:text-vault-300"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        {files.documents?.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {files.documents.map((file: FileDocument) => (
              <li
                role="button"
                tabIndex={0}
                onClick={() => setPreviewFile(file)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setPreviewFile(file);
                  }
                }}
                className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/60"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={getThumbnailSrc(file)}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption text-muted-foreground"
                    />
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <ActionDropdown file={file} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="No files uploaded yet"
            description="Upload your first file to see it here."
            className="py-10"
          />
        )}
      </div>

      {/* Activity log */}
      <div className="bento-card lg:col-span-1">
        <h2 className="h4 mb-4 flex items-center gap-2 font-display">
          <History
            className="size-4 text-vault-600 dark:text-vault-300"
            aria-hidden="true"
          />
          Recent activity
        </h2>
        {activity.length > 0 ? (
          <ul className="space-y-4">
            {activity.map((entry) => (
              <li
                key={entry.$id}
                className="flex flex-col gap-0.5 border-l-2 border-vault-600/20 pl-3 dark:border-vault-400/20"
              >
                <p className="body-2">
                  <span className="font-medium">{entry.actorName}</span>{' '}
                  {(ACTION_LABELS[entry.action] ?? entry.action).toLowerCase()}{' '}
                  <span className="font-medium">{entry.fileName}</span>
                </p>
                {describeActivityMeta(entry) && (
                  <p className="caption text-muted-foreground">
                    {describeActivityMeta(entry)}
                  </p>
                )}
                <FormattedDateTime
                  date={entry.at}
                  className="caption text-muted-foreground"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="body-2 text-muted-foreground">
            Activity from uploads, shares and moves will show up here.
          </p>
        )}
      </div>

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default DashboardContent;
