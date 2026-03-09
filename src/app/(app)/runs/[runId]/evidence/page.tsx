'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Camera, Receipt, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { missionTemplates } from '@/data/missions/templates';
import { createEvidenceItem } from '@/lib/mission-engine';
import { evidenceSchema, type EvidenceInput } from '@/lib/validation/evidence';
import { loadAttachmentFromDevice, saveAttachmentToDevice } from '@/lib/store/local-attachments';
import { demoUser, loadEvidence, loadRuns, saveEvidence } from '@/lib/store/demo-store';
import { useEffect, useMemo, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 3_000_000;

export default function EvidencePage() {
  const params = useParams<{ runId: string }>();
  const [items, setItems] = useState(loadEvidence(params.runId));
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deviceStorageMessage, setDeviceStorageMessage] = useState<string | null>('Attachments are stored on this device by default.');
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const run = loadRuns().find((item) => item.id === params.runId);
  const template = useMemo(() => missionTemplates.find((item) => item.id === run?.templateId), [run]);
  const { register, handleSubmit, reset, formState } = useForm<EvidenceInput>({
    resolver: zodResolver(evidenceSchema),
    defaultValues: { type: 'photo' }
  });

  useEffect(() => {
    let active = true;
    const urls: string[] = [];

    async function loadPreviews() {
      const nextEntries = await Promise.all(
        items.map(async (item) => {
          const stored = await loadAttachmentFromDevice(item.storagePath);
          if (!stored || !stored.type.startsWith('image/')) return null;
          const url = URL.createObjectURL(stored.file);
          urls.push(url);
          return [item.id, url] as const;
        })
      );

      if (active) {
        setPreviewUrls(Object.fromEntries(nextEntries.filter(Boolean) as Array<readonly [string, string]>));
      }
    }

    void loadPreviews();

    return () => {
      active = false;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  const onSubmit = async (values: EvidenceInput) => {
    let storagePath: string | undefined;
    let finalAttachmentName = attachmentName;

    if (selectedFile) {
      const deviceAttachment = await saveAttachmentToDevice(selectedFile, params.runId);
      if (deviceAttachment) {
        storagePath = deviceAttachment.storagePath;
        finalAttachmentName = deviceAttachment.attachmentName;
        setDeviceStorageMessage('Attachment saved on this device. You can keep cloud storage off until you need to export or share.');
      } else {
        setDeviceStorageMessage('Local file storage was unavailable, so only the evidence details were saved.');
      }
    }

    saveEvidence(
      createEvidenceItem({
        missionRunId: params.runId,
        userId: demoUser.id,
        attachmentName: finalAttachmentName,
        storagePath,
        ...values
      })
    );
    setItems(loadEvidence(params.runId));
    setAttachmentName(undefined);
    setSelectedFile(null);
    reset({ type: 'photo', title: '', description: '' });
  };

  return (
    <main className="shell space-y-4 pb-28">
      <Card className="space-y-3">
        <h1 className="text-xl font-semibold">Evidence vault</h1>
        <p className="text-sm text-slate-300">Focus on what happened, what you did, and who you contacted.</p>
        <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
          <select {...register('type')} className="w-full rounded-xl border border-white/15 bg-slate-950/60 p-3 text-sm">
            <option value="photo">Photo</option>
            <option value="note">Note</option>
            <option value="receipt">Receipt</option>
            <option value="contact">Contact log</option>
            <option value="fact">Key fact</option>
          </select>
          <Input placeholder="Title" {...register('title')} />
          <Textarea placeholder="Description (optional)" {...register('description')} />
          {template && (
            <select
              {...register('linkedStepId')}
              className="w-full rounded-xl border border-white/15 bg-slate-950/60 p-3 text-sm"
              defaultValue=""
            >
              <option value="">Link to mission step (optional)</option>
              {template.stepDefinitions.map((step) => (
                <option key={step.id} value={step.id}>
                  {step.title}
                </option>
              ))}
            </select>
          )}
          <label className="block rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-4 text-sm text-slate-300">
            <span className="mb-2 flex items-center gap-2 font-medium text-slate-100">
              <Camera className="h-4 w-4 text-cyan-200" />
              Add photo or receipt
            </span>
            <span className="mb-3 block text-xs text-slate-400">
              Local-first storage keeps the attachment on this device. In Firebase mode, upload can remain optional.
            </span>
            <input
              className="w-full text-xs"
              type="file"
              accept="image/*,.pdf"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  setAttachmentName(undefined);
                  setSelectedFile(null);
                  setUploadError(null);
                  return;
                }

                if (file.size > MAX_FILE_SIZE_BYTES) {
                  setAttachmentName(undefined);
                  setSelectedFile(null);
                  setUploadError('Upload failed: choose a file under 3MB, then try again.');
                  return;
                }

                setUploadError(null);
                setAttachmentName(file.name);
                setSelectedFile(file);
              }}
            />
          </label>
          {attachmentName && <p className="text-xs text-emerald-300">Attachment queued: {attachmentName}</p>}
          {deviceStorageMessage && <p className="text-xs text-cyan-200">{deviceStorageMessage}</p>}
          {uploadError && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-200">
              <p className="flex items-center gap-2 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                {uploadError}
              </p>
              <p className="mt-1">You can retry with a smaller image or continue with a note-only entry.</p>
            </div>
          )}
          {formState.errors.title && <p className="text-xs text-rose-300">{formState.errors.title.message}</p>}
          <Button type="submit">Secure evidence</Button>
        </form>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Saved evidence</h2>
          <span className="text-xs text-slate-400">{items.length} items secured</span>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-slate-300">No evidence yet. Add your first proof item now.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm" key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-slate-400">
                      {item.type} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {item.type === 'receipt' ? (
                    <Receipt className="h-4 w-4 text-amber-200" />
                  ) : (
                    <ScrollText className="h-4 w-4 text-cyan-200" />
                  )}
                </div>
                {previewUrls[item.id] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={item.title} className="mt-3 h-28 w-full rounded-xl object-cover" src={previewUrls[item.id]} />
                )}
                {item.description && <p className="mt-2 text-slate-300">{item.description}</p>}
                {item.attachmentName && (
                  <p className="mt-2 text-xs text-emerald-300">
                    Attachment: {item.attachmentName} {item.storagePath ? '· stored on this device' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
      <Link href={`/runs/${params.runId}`}>Back to mission</Link>
    </main>
  );
}
