'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({ value, onChange, maxFiles = 8 }: ImageUploadProps) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (value.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} photos allowed.`);
      return;
    }
    setError('');
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('car-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (upErr) {
        setError(`Upload failed: ${upErr.message}`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('car-images').getPublicUrl(fileName);
      uploaded.push(data.publicUrl);
    }

    onChange([...value, ...uploaded]);
    setUploading(false);
  }

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {value.map((url) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
            <img src={url} alt="Car photo" className="w-full h-full object-cover" loading="lazy" />
            <button
              type="button"
              onClick={() => removeImage(url)}
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
              <div className="w-5 h-5 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
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

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">{value.length}/{maxFiles} photos uploaded. First photo is the cover.</p>
    </div>
  );
}
