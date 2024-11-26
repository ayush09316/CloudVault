'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Sort from '@/components/Sort';
import FileCard from '@/components/FileCard';
import { Models } from 'node-appwrite';
import { convertFileSize } from '@/lib/utils';
import Card from './Card';

type FileViewerProps = {
  files: Models.Document[];
  totalSize: number;
  type: string;
};

const FileViewer = ({ files, totalSize, type }: FileViewerProps) => {
  const [isActive, setIsActive] = useState(true);

  const handleToggle = useCallback(() => setIsActive((prev) => !prev), []);

  // Memoize the total size display to avoid recalculating on each render
  const totalSizeText = useMemo(
    () => (
      <p className="body-1">
        Total: <span className="h5">{convertFileSize(totalSize)}</span>
      </p>
    ),
    [totalSize]
  );

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          {totalSizeText}

          <div className="flex items-center gap-4">
            <div className="sort-container">
              <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>
              <Sort />
            </div>
            <Button
              onClick={handleToggle}
              className={`hidden rounded-lg p-2 lg:block ${
                isActive ? 'bg-brand' : 'bg-gray-400'
              } hover:bg-brand/80`}
            >
              <Image
                src="/assets/images/view.svg"
                alt="view"
                width={20}
                height={20}
              />
            </Button>
          </div>
        </div>
      </section>

      {files?.length > 0 ? (
        <section className={isActive ? 'file-list' : 'file-stack'}>
          {files.map((file: Models.Document) =>
            isActive ? (
              <Card key={file.$id} file={file} />
            ) : (
              <FileCard key={file.$id} file={file} />
            )
          )}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default FileViewer;
