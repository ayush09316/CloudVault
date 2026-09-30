'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { renameFile } from '@/lib/actions/file.actions';

const ShareRenameForm = ({
  fileId,
  token,
  name,
  extension,
}: {
  fileId: string;
  token: string;
  name: string;
  extension: string;
}) => {
  const path = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(
    extension ? name.replace(new RegExp(`\\.${extension}$`, 'i'), '') : name
  );
  const [status, setStatus] = useState<string | null>(null);

  const submit = async () => {
    setStatus(null);
    try {
      await renameFile({
        fileId,
        name: value,
        extension,
        path,
        shareToken: token,
      });
      setStatus('Renamed.');
      router.refresh();
    } catch {
      setStatus('Rename failed.');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button variant="outline" onClick={submit}>
        Rename
      </Button>
      {status && <p className="body-2 text-light-200">{status}</p>}
    </div>
  );
};

export default ShareRenameForm;
