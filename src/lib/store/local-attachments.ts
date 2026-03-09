'use client';

const DB_NAME = 'life-boss-fight-device-files';
const STORE_NAME = 'attachments';
const LOCAL_DEVICE_PREFIX = 'local-device://';

interface StoredAttachment {
  id: string;
  file: Blob;
  name: string;
  type: string;
  missionRunId: string;
  createdAt: string;
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function isLocalDevicePath(path?: string) {
  return Boolean(path?.startsWith(LOCAL_DEVICE_PREFIX));
}

export async function saveAttachmentToDevice(file: File, missionRunId: string) {
  const db = await openDatabase();
  if (!db) return null;

  const id = `${missionRunId}-${Date.now()}-${file.name}`;
  const record: StoredAttachment = {
    id,
    file,
    name: file.name,
    type: file.type,
    missionRunId,
    createdAt: new Date().toISOString()
  };

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  return {
    storagePath: `${LOCAL_DEVICE_PREFIX}${id}`,
    attachmentName: file.name
  };
}

export async function loadAttachmentFromDevice(storagePath?: string) {
  if (!storagePath || !isLocalDevicePath(storagePath)) return null;
  const id = storagePath.replace(LOCAL_DEVICE_PREFIX, '');
  const db = await openDatabase();
  if (!db) return null;

  return new Promise<StoredAttachment | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve((request.result as StoredAttachment | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function clearDeviceAttachments() {
  const db = await openDatabase();
  if (!db) return;

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
