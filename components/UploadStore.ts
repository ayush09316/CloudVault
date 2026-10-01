'use client';

import { useSyncExternalStore } from 'react';
import { MAX_FILE_SIZE } from '@/constants';
import {
  deleteFile,
  permanentlyDeleteFile,
  uploadFile,
} from '@/lib/actions/file.actions';

export type UploadStatus =
  | 'queued'
  | 'uploading'
  | 'done'
  | 'error'
  | 'cancelled';

export interface UploadItem {
  id: string;
  file: File;
  parentId: string | null;
  path: string;
  status: UploadStatus;
  progress: number;
  error?: string;
  startedAt?: number;
}

type State = { items: UploadItem[]; collapsed: boolean; open: boolean };

const CONCURRENCY = 1;
const ASSUMED_BPS = 1.5 * 1024 * 1024;

let state: State = { items: [], collapsed: false, open: false };
const listeners = new Set<() => void>();
const cancelled = new Set<string>();
const inflight = new Set<string>();
let ticker: number | null = null;

const emit = () => listeners.forEach((l) => l());
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  emit();
};
const patch = (id: string, p: Partial<UploadItem>) =>
  set({ items: state.items.map((i) => (i.id === id ? { ...i, ...p } : i)) });

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const estimate = (item: UploadItem) => {
  if (!item.startedAt) return 0;
  const expected = Math.max(800, (item.file.size / ASSUMED_BPS) * 1000);
  const t = (Date.now() - item.startedAt) / expected;
  return Math.min(0.94, 1 - Math.exp(-2.2 * t));
};

const ensureTicker = () => {
  if (ticker !== null || typeof window === 'undefined') return;
  ticker = window.setInterval(() => {
    const active = state.items.some((i) => i.status === 'uploading');
    if (!active) {
      window.clearInterval(ticker!);
      ticker = null;
      return;
    }
    set({
      items: state.items.map((i) =>
        i.status === 'uploading' ? { ...i, progress: estimate(i) } : i
      ),
    });
  }, 120);
};

const discard = async (doc: { $id: string }, path: string) => {
  try {
    await deleteFile({ fileId: doc.$id, path });
    await permanentlyDeleteFile({ fileId: doc.$id, path });
  } catch (e) {
    console.error('Failed to discard cancelled upload', e);
  }
};

const run = async (item: UploadItem) => {
  inflight.add(item.id);
  patch(item.id, { status: 'uploading', startedAt: Date.now(), progress: 0 });
  ensureTicker();
  try {
    const result = await uploadFile({
      file: item.file,
      parentId: item.parentId,
      path: item.path,
    });
    if (cancelled.has(item.id)) {
      if (result && !('error' in result)) await discard(result, item.path);
      return;
    }
    if (!result) {
      patch(item.id, { status: 'error', error: 'Upload failed' });
    } else if ('error' in result) {
      patch(item.id, { status: 'error', error: String(result.error) });
    } else {
      patch(item.id, { status: 'done', progress: 1 });
    }
  } catch (error) {
    console.error(`Failed to upload ${item.file.name}:`, error);
    if (!cancelled.has(item.id)) {
      patch(item.id, { status: 'error', error: 'Upload failed' });
    }
  } finally {
    inflight.delete(item.id);
    cancelled.delete(item.id);
    pump();
  }
};

const pump = () => {
  const active = state.items.filter((i) => i.status === 'uploading').length;
  const slots = CONCURRENCY - active;
  if (slots <= 0) return;
  state.items
    .filter((i) => i.status === 'queued')
    .slice(0, slots)
    .forEach((i) => run(i));
};

export const uploadStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get: () => state,

  enqueue(files: File[], ctx: { parentId: string | null; path: string }) {
    if (!files.length) return;
    const items: UploadItem[] = files.map((file) => {
      const tooBig = file.size > MAX_FILE_SIZE;
      return {
        id: uid(),
        file,
        parentId: ctx.parentId,
        path: ctx.path,
        status: tooBig ? 'error' : 'queued',
        progress: 0,
        error: tooBig
          ? `Larger than the ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} MB limit`
          : undefined,
      };
    });
    set({ items: [...state.items, ...items], open: true, collapsed: false });
    pump();
  },

  cancel(id: string) {
    const item = state.items.find((i) => i.id === id);
    if (!item || item.status === 'done' || item.status === 'cancelled') return;
    if (item.status === 'uploading') cancelled.add(id);
    patch(id, { status: 'cancelled' });
    pump();
  },

  cancelAll() {
    state.items
      .filter((i) => i.status === 'queued' || i.status === 'uploading')
      .forEach((i) => uploadStore.cancel(i.id));
  },

  retry(id: string) {
    const item = state.items.find((i) => i.id === id);
    if (!item || inflight.has(id) || item.file.size > MAX_FILE_SIZE) return;
    patch(id, { status: 'queued', progress: 0, error: undefined });
    pump();
  },

  dismiss(id: string) {
    set({ items: state.items.filter((i) => i.id !== id) });
    if (state.items.length === 0) set({ open: false });
  },

  close() {
    set({
      open: false,
      items: state.items.filter(
        (i) => i.status === 'queued' || i.status === 'uploading'
      ),
    });
  },

  setCollapsed(collapsed: boolean) {
    set({ collapsed });
  },
};

const server = () => state;
export const useUploads = () =>
  useSyncExternalStore(uploadStore.subscribe, uploadStore.get, server);

let owners: symbol[] = [];
export const claimUploader = (token: symbol) => {
  owners.push(token);
  return () => {
    owners = owners.filter((t) => t !== token);
  };
};
export const isPrimaryUploader = (token: symbol) => owners[0] === token;
