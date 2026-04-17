'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface ImageUploadProps {
  images: string[];          // current list of public URLs
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 6 }: ImageUploadProps) {
  const { lang } = useLanguage();
  const tx = translations[lang];
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError('');

    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);

    if (toUpload.length === 0) {
      setError(`${tx.imageUploadMaxPhotos} ${maxImages}`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError(tx.imageUploadLoginRequired);
      setUploading(false);
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of toUpload) {
      // accept any image type including HEIC from iPhones
      if (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.heic')) {
        setError(tx.imageUploadImagesOnly);
        continue;
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filename, file, { upsert: false, contentType: file.type || 'image/jpeg' });

      if (uploadError) {
        setError(`${tx.imageUploadFailed} ${uploadError.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(filename);

      uploadedUrls.push(publicUrl);
    }

    onChange([...images, ...uploadedUrls]);
    setUploading(false);

    // reset file input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }

  function removeImage(url: string) {
    onChange(images.filter(u => u !== url));
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">{tx.imageUploadPhotos}</label>

      {/* Upload zone */}
      {images.length < maxImages && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
               <p className="text-sm text-gray-500">{tx.imageUploadUploading}</p>
            </>
          ) : (
            <>
              <Upload size={24} className="text-gray-400" />
               <p className="text-sm font-medium text-gray-600">{tx.imageUploadTapToAdd}</p>
               <p className="text-xs text-gray-400">{tx.imageUploadFormats.replace('{count}', String(maxImages))}</p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input — accept all image types including HEIC */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        capture="environment"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group">
              <Image
                src={url}
                alt={`Car photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 200px"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={tx.imageUploadRemovePhoto}
              >
                <X size={14} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  {tx.imageUploadCover}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ImageIcon size={14} />
          <span>{tx.imageUploadFirstCover}</span>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
