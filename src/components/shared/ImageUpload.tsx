'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  uploading?: boolean;
  uploadProgress?: number | null;
}

export async function uploadImages(
  files: File[],
  userId: string,
  onProgress?: (uploadedCount: number, totalCount: number) => void
) {
  const supabase = createClient();
  const urls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const { error } = await supabase.storage.from('car-images').upload(path, file);

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage.from('car-images').getPublicUrl(path);
    urls.push(data.publicUrl);
    onProgress?.(index + 1, files.length);
  }

  return urls;
}

export default function ImageUpload({
  value,
  onChange,
  maxFiles = 8,
  uploading = false,
  uploadProgress = null,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(
    () => value.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [value]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    const availableSlots = maxFiles - value.length;
    const nextFiles = incoming.slice(0, availableSlots);
    if (nextFiles.length === 0) return;

    onChange([...value, ...nextFiles]);
  }

  function removeImage(indexToRemove: number) {
    onChange(value.filter((_, index) => index !== indexToRemove));
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {previews.map(({ file, url }, index) => (
          <div key={`${file.name}-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
            <img src={url} alt="Car photo" className="w-full h-full object-cover" loading="lazy" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              aria-label="Remove photo"
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}

        {value.length < maxFiles && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="text-center space-y-1">
                <div className="mx-auto w-5 h-5 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                {uploadProgress !== null && (
                  <span className="text-[10px] text-green-600 font-medium">{uploadProgress}%</span>
                )}
              </div>
            ) : (
              <>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                <span className="text-xs font-medium">Add photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploading && uploadProgress !== null && (
        <p className="text-xs text-green-600 mt-1">Upload progress: {uploadProgress}%</p>
      )}
      <p className="text-xs text-gray-400 mt-1">
        {value.length}/{maxFiles} photos selected.
        {value.length > 0 && ' First photo is the cover.'}
      </p>
    </div>
  );
}
