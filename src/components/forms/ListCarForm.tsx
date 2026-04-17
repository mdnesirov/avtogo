'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import { ImageIcon, Upload, X } from 'lucide-react';

type UploadProgress = {
  current: number;
  total: number;
};

type LocalImage = {
  file: File;
  previewUrl: string;
};

const MAX_IMAGES = 6;

const COPY = {
  az: {
    brand: 'Marka',
    model: 'Model',
    year: 'İl',
    pricePerDay: 'Günlük qiymət (AZN)',
    carType: 'Avtomobil növü',
    transmission: 'Sürətlər qutusu',
    fuelType: 'Yanacaq növü',
    city: 'Şəhər',
    whatsapp: 'WhatsApp nömrəsi (istəyə bağlı)',
    description: 'Təsvir',
    descriptionPlaceholder: 'Avtomobili, vəziyyətini və əlavə üstünlükləri təsvir edin...',
    photos: 'Şəkillər',
    uploadTitle: 'Şəkil əlavə etmək üçün klikləyin',
    uploadHint: `JPG, PNG, HEIC (iPhone) · maksimum ${MAX_IMAGES} şəkil`,
    firstPhotoHint: 'İlk şəkil elan üçün örtük şəkli olacaq',
    onlyImages: 'Yalnız şəkil faylları dəstəklənir.',
    maxPhotos: `Maksimum ${MAX_IMAGES} şəkil yükləyə bilərsiniz.`,
    removePhoto: 'Şəkli sil',
    cover: 'Örtük',
    requireDeposit: 'Zəmanət depoziti tələb et',
    depositAmount: 'Depozit məbləği (AZN)',
    depositHint: 'Təsdiqdən sonra ləğv və ya avtomobilin götürülməməsi halında sizə ödənilir.',
    offerCityDelivery: 'Şəhər daxili çatdırılma təklif et',
    cityDeliveryFee: 'Çatdırılma haqqı (AZN)',
    offerAirportDelivery: 'Hava limanına çatdırılma təklif et (Heydər Əliyev Beynəlxalq)',
    airportDeliveryFee: 'Hava limanına çatdırılma haqqı (AZN)',
    publish: 'Elanı paylaş',
    creating: 'Elan yaradılır...',
    uploadingProgress: 'Şəkillər yüklənir: {current}/{total}',
    savingListing: 'Elan yadda saxlanılır...',
    authRequired: 'Avtomobil əlavə etmək üçün daxil olun.',
    uploadFailed: 'Şəkil yükləmə alınmadı.',
    createFailed: 'Elan yaradılmadı.',
    genericError: 'Xəta baş verdi. Yenidən cəhd edin.',
    validation: {
      brandRequired: 'Markanı daxil edin.',
      modelRequired: 'Modeli daxil edin.',
      yearInvalid: 'İli düzgün daxil edin.',
      priceInvalid: 'Günlük qiymət 0-dan böyük olmalıdır.',
      locationRequired: 'Şəhər seçin.',
      depositInvalid: 'Depozit məbləğini düzgün daxil edin.',
      deliveryInvalid: 'Çatdırılma haqqını düzgün daxil edin.',
      airportDeliveryInvalid: 'Hava limanı çatdırılma haqqını düzgün daxil edin.',
      imagesRequired: 'Ən azı bir şəkil əlavə edin.',
    },
  },
  ru: {
    brand: 'Марка',
    model: 'Модель',
    year: 'Год',
    pricePerDay: 'Цена за день (AZN)',
    carType: 'Тип автомобиля',
    transmission: 'Коробка передач',
    fuelType: 'Тип топлива',
    city: 'Город',
    whatsapp: 'Номер WhatsApp (необязательно)',
    description: 'Описание',
    descriptionPlaceholder: 'Опишите автомобиль, состояние и дополнительные опции...',
    photos: 'Фотографии',
    uploadTitle: 'Нажмите, чтобы добавить фото',
    uploadHint: `JPG, PNG, HEIC (iPhone) · до ${MAX_IMAGES} фото`,
    firstPhotoHint: 'Первое фото будет обложкой объявления',
    onlyImages: 'Поддерживаются только изображения.',
    maxPhotos: `Можно загрузить максимум ${MAX_IMAGES} фото.`,
    removePhoto: 'Удалить фото',
    cover: 'Обложка',
    requireDeposit: 'Требовать залог',
    depositAmount: 'Сумма залога (AZN)',
    depositHint: 'Выплачивается вам при отмене после подтверждения или неявке арендатора.',
    offerCityDelivery: 'Предлагать доставку по городу',
    cityDeliveryFee: 'Стоимость доставки (AZN)',
    offerAirportDelivery: 'Предлагать доставку в аэропорт (Heydar Aliyev International)',
    airportDeliveryFee: 'Стоимость доставки в аэропорт (AZN)',
    publish: 'Опубликовать объявление',
    creating: 'Создание объявления...',
    uploadingProgress: 'Загрузка фото: {current}/{total}',
    savingListing: 'Сохранение объявления...',
    authRequired: 'Войдите, чтобы разместить автомобиль.',
    uploadFailed: 'Не удалось загрузить фото.',
    createFailed: 'Не удалось создать объявление.',
    genericError: 'Что-то пошло не так. Попробуйте снова.',
    validation: {
      brandRequired: 'Введите марку.',
      modelRequired: 'Введите модель.',
      yearInvalid: 'Введите корректный год.',
      priceInvalid: 'Цена за день должна быть больше 0.',
      locationRequired: 'Выберите город.',
      depositInvalid: 'Введите корректную сумму залога.',
      deliveryInvalid: 'Введите корректную стоимость доставки.',
      airportDeliveryInvalid: 'Введите корректную стоимость доставки в аэропорт.',
      imagesRequired: 'Добавьте хотя бы одно фото.',
    },
  },
  en: {
    brand: 'Brand',
    model: 'Model',
    year: 'Year',
    pricePerDay: 'Price per day (AZN)',
    carType: 'Car Type',
    transmission: 'Transmission',
    fuelType: 'Fuel Type',
    city: 'City',
    whatsapp: 'WhatsApp number (optional)',
    description: 'Description',
    descriptionPlaceholder: 'Describe your car, condition, and extras...',
    photos: 'Photos',
    uploadTitle: 'Tap to add photos',
    uploadHint: `JPG, PNG, HEIC (iPhone) · up to ${MAX_IMAGES} photos`,
    firstPhotoHint: 'First photo will be the cover image shown on listings',
    onlyImages: 'Only image files are supported.',
    maxPhotos: `Maximum ${MAX_IMAGES} photos allowed.`,
    removePhoto: 'Remove photo',
    cover: 'Cover',
    requireDeposit: 'Require security deposit',
    depositAmount: 'Deposit amount (AZN)',
    depositHint: 'Paid to you if renter cancels after confirming or does not collect the car.',
    offerCityDelivery: 'Offer city delivery',
    cityDeliveryFee: 'Delivery fee (AZN)',
    offerAirportDelivery: 'Offer airport delivery (Heydar Aliyev International)',
    airportDeliveryFee: 'Airport delivery fee (AZN)',
    publish: 'Publish Listing',
    creating: 'Creating listing...',
    uploadingProgress: 'Uploading photos: {current}/{total}',
    savingListing: 'Saving listing...',
    authRequired: 'You must be logged in to list a car.',
    uploadFailed: 'Upload failed.',
    createFailed: 'Failed to create listing.',
    genericError: 'Something went wrong. Please try again.',
    validation: {
      brandRequired: 'Brand is required.',
      modelRequired: 'Model is required.',
      yearInvalid: 'Year is invalid.',
      priceInvalid: 'Price per day must be greater than 0.',
      locationRequired: 'City is required.',
      depositInvalid: 'Deposit amount is invalid.',
      deliveryInvalid: 'Delivery fee is invalid.',
      airportDeliveryInvalid: 'Airport delivery fee is invalid.',
      imagesRequired: 'Please add at least one photo.',
    },
  },
} as const;

export default function ListCarForm() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = COPY[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<LocalImage[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ current: 0, total: 0 });
  const [images, setImages] = useState<LocalImage[]>([]);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    car_type: 'sedan',
    transmission: 'automatic',
    fuel_type: 'petrol',
    price_per_day: '',
    deposit_amount: '',
    delivery_fee: '',
    airport_delivery_fee: '',
    whatsapp_phone: '',
    location: 'Baku',
    description: '',
  });
  const [requiresDeposit, setRequiresDeposit] = useState(false);
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [offersAirport, setOffersAirport] = useState(false);

  useEffect(() => {
    imageRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imageRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function validateForm() {
    const brand = form.brand.trim();
    const model = form.model.trim();
    const year = Number(form.year);
    const pricePerDay = Number(form.price_per_day);
    const maxYear = new Date().getFullYear() + 1;

    if (!brand) return t.validation.brandRequired;
    if (!model) return t.validation.modelRequired;
    if (!Number.isInteger(year) || year < 1900 || year > maxYear) return t.validation.yearInvalid;
    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) return t.validation.priceInvalid;
    if (!form.location.trim()) return t.validation.locationRequired;
    if (requiresDeposit) {
      const depositAmount = Number(form.deposit_amount);
      if (!Number.isFinite(depositAmount) || depositAmount <= 0) return t.validation.depositInvalid;
    }
    if (offersDelivery && form.delivery_fee.trim() !== '') {
      const deliveryFee = Number(form.delivery_fee);
      if (!Number.isFinite(deliveryFee) || deliveryFee < 0) return t.validation.deliveryInvalid;
    }
    if (offersAirport && form.airport_delivery_fee.trim() !== '') {
      const airportDeliveryFee = Number(form.airport_delivery_fee);
      if (!Number.isFinite(airportDeliveryFee) || airportDeliveryFee < 0) return t.validation.airportDeliveryInvalid;
    }
    if (images.length === 0) return t.validation.imagesRequired;

    return null;
  }

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError('');

    const remaining = MAX_IMAGES - images.length;
    const nextFiles = Array.from(fileList).slice(0, remaining);

    if (nextFiles.length === 0) {
      setError(t.maxPhotos);
      return;
    }

    const validImages: LocalImage[] = [];

    for (const file of nextFiles) {
      const isImage = file.type.startsWith('image/') || /\.(heic|heif)$/i.test(file.name);
      if (!isImage) {
        setError(t.onlyImages);
        continue;
      }
      validImages.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (validImages.length > 0) {
      setImages((prev) => [...prev, ...validImages]);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function removeUploadedObjects(supabase: ReturnType<typeof createClient>, paths: string[]) {
    if (paths.length === 0) return;
    await supabase.storage.from('car-images').remove(paths);
  }

  async function uploadImages(
    supabase: ReturnType<typeof createClient>,
    userId: string,
    selectedImages: LocalImage[]
  ) {
    const uploadedPaths: string[] = [];
    const uploadedUrls: string[] = [];

    setUploadProgress({ current: 0, total: selectedImages.length });

    for (let i = 0; i < selectedImages.length; i += 1) {
      const { file } = selectedImages[i];
      const extension = file.name.split('.').pop() || 'jpg';
      const filePath = `${userId}/${crypto.randomUUID()}-${i}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file, { upsert: false, contentType: file.type || 'image/jpeg' });

      if (uploadError) {
        await removeUploadedObjects(supabase, uploadedPaths);
        throw new Error(`${t.uploadFailed} ${uploadError.message}`);
      }

      uploadedPaths.push(filePath);
      const { data } = supabase.storage.from('car-images').getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
      setUploadProgress({ current: i + 1, total: selectedImages.length });
    }

    return { uploadedPaths, uploadedUrls };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(t.authRequired);
        router.push('/auth/login');
        return;
      }

      const { uploadedPaths, uploadedUrls } = await uploadImages(supabase, user.id, images);

      const brand = form.brand.trim();
      const model = form.model.trim();
      const year = Number(form.year);

      const payload = {
        owner_id: user.id,
        car_name: `${brand} ${model} ${year}`,
        brand,
        model,
        year,
        car_type: form.car_type || null,
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        price_per_day: Number(form.price_per_day),
        location: form.location.trim(),
        description: form.description.trim() || null,
        images: uploadedUrls,
        airport_delivery: offersAirport,
        whatsapp_phone: form.whatsapp_phone.trim() || null,
        requires_deposit: requiresDeposit,
        deposit_amount: requiresDeposit ? Number(form.deposit_amount) : null,
        offers_delivery: offersDelivery,
        delivery_fee: offersDelivery && form.delivery_fee.trim() !== '' ? Number(form.delivery_fee) : null,
        offers_airport_delivery: offersAirport,
        airport_delivery_fee:
          offersAirport && form.airport_delivery_fee.trim() !== '' ? Number(form.airport_delivery_fee) : null,
      };

      setUploadProgress((prev) => ({ ...prev, current: prev.total }));

      const { error: insertError } = await supabase.from('cars').insert(payload).select('id').single();

      if (insertError) {
        await removeUploadedObjects(supabase, uploadedPaths);
        throw new Error(`${t.createFailed} ${insertError.message}`);
      }

      router.push('/dashboard');
      router.refresh();
    } catch (submissionError: unknown) {
      setError(submissionError instanceof Error ? submissionError.message : t.genericError);
    } finally {
      setLoading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  }

  const selectClass =
    'w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600';
  const labelClass = 'text-sm font-medium text-gray-700';
  const sectionClass = 'bg-gray-50 rounded-xl p-4 space-y-3';

  const progressPercent =
    uploadProgress.total > 0 ? Math.round((uploadProgress.current / uploadProgress.total) * 100) : 0;
  const progressText =
    uploadProgress.total > 0
      ? t.uploadingProgress
          .replace('{current}', String(uploadProgress.current))
          .replace('{total}', String(uploadProgress.total))
      : t.savingListing;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label={t.brand} placeholder="Toyota" value={form.brand} onChange={handleChange('brand')} required />
        <Input label={t.model} placeholder="Camry" value={form.model} onChange={handleChange('model')} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t.year}
          type="number"
          placeholder="2022"
          value={form.year}
          onChange={handleChange('year')}
          min="1990"
          max={String(new Date().getFullYear() + 1)}
          required
        />
        <Input
          label={t.pricePerDay}
          type="number"
          placeholder="80"
          value={form.price_per_day}
          onChange={handleChange('price_per_day')}
          min="1"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>{t.carType}</label>
        <select value={form.car_type} onChange={handleChange('car_type')} className={selectClass}>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="minivan">Minivan</option>
          <option value="pickup">Pickup</option>
          <option value="coupe">Coupe</option>
          <option value="convertible">Convertible</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>{t.transmission}</label>
          <select value={form.transmission} onChange={handleChange('transmission')} className={selectClass}>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>{t.fuelType}</label>
          <select value={form.fuel_type} onChange={handleChange('fuel_type')} className={selectClass}>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={labelClass}>{t.city}</label>
        <select value={form.location} onChange={handleChange('location')} className={selectClass}>
          <option value="Baku">Baku</option>
          <option value="Ganja">Ganja</option>
          <option value="Sumqayit">Sumqayit</option>
          <option value="Sheki">Sheki</option>
        </select>
      </div>

      <Input
        label={t.whatsapp}
        placeholder="+994501234567"
        value={form.whatsapp_phone}
        onChange={handleChange('whatsapp_phone')}
      />

      <div className="flex flex-col gap-1">
        <label className={labelClass}>{t.description}</label>
        <textarea
          placeholder={t.descriptionPlaceholder}
          value={form.description}
          onChange={handleChange('description')}
          rows={4}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">{t.photos}</label>

        {images.length < MAX_IMAGES && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <Upload size={24} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-600">{t.uploadTitle}</p>
            <p className="text-xs text-gray-400">{t.uploadHint}</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div key={image.previewUrl} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group">
                <img
                  src={image.previewUrl}
                  alt={`${t.photos} ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={t.removePhoto}
                >
                  <X size={14} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    {t.cover}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ImageIcon size={14} />
            <span>{t.firstPhotoHint}</span>
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresDeposit}
            onChange={(event) => setRequiresDeposit(event.target.checked)}
            className="w-4 h-4 accent-green-600"
          />
          <span className={labelClass}>{t.requireDeposit}</span>
        </label>
        {requiresDeposit && (
          <Input
            label={t.depositAmount}
            type="number"
            placeholder="200"
            value={form.deposit_amount}
            onChange={handleChange('deposit_amount')}
            min="1"
            required
          />
        )}
        <p className="text-xs text-gray-400">{t.depositHint}</p>
      </div>

      <div className={sectionClass}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={offersDelivery}
            onChange={(event) => setOffersDelivery(event.target.checked)}
            className="w-4 h-4 accent-green-600"
          />
          <span className={labelClass}>{t.offerCityDelivery}</span>
        </label>
        {offersDelivery && (
          <Input
            label={t.cityDeliveryFee}
            type="number"
            placeholder="20"
            value={form.delivery_fee}
            onChange={handleChange('delivery_fee')}
            min="0"
          />
        )}
      </div>

      <div className={sectionClass}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={offersAirport}
            onChange={(event) => setOffersAirport(event.target.checked)}
            className="w-4 h-4 accent-green-600"
          />
          <span className={labelClass}>{t.offerAirportDelivery}</span>
        </label>
        {offersAirport && (
          <Input
            label={t.airportDeliveryFee}
            type="number"
            placeholder="40"
            value={form.airport_delivery_fee}
            onChange={handleChange('airport_delivery_fee')}
            min="0"
          />
        )}
      </div>

      {loading && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{progressText}</p>
          {uploadProgress.total > 0 && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? t.creating : t.publish}
      </Button>
    </form>
  );
}
