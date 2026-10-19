import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

const BUCKET = 'portfolio';
const MAX_BYTES = 5 * 1024 * 1024;

type Props = {
  value: string;
  onChange: (url: string) => void;
  placeholder: string;
  folder: string;
  accept?: string;
};

export default function ImageUpload({ value, onChange, placeholder, folder, accept = 'image/*' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const isImage = accept.startsWith('image');
  const previewSrc = value.startsWith('http') || value.startsWith('/') ? value : `/${value}`;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setError('ไฟล์ใหญ่เกิน 5 MB');
      return;
    }

    setUploading(true);
    setError('');

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      cacheControl: '31536000',
    });

    if (uploadError) {
      setError(`อัปโหลดไม่สำเร็จ: ${uploadError.message}`);
    } else {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="admin-input"
          style={{ flex: 1 }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          style={{
            background: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: '8px',
            padding: '0 16px', cursor: uploading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {uploading ? 'กำลังอัปโหลด...' : 'เลือกไฟล์'}
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} style={{ display: 'none' }} />
      </div>
      {error && <span style={{ color: '#ef4444', fontSize: '13px' }}>{error}</span>}
      {isImage && value && (
        <img
          src={previewSrc}
          alt="ตัวอย่าง"
          style={{ maxHeight: '120px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', alignSelf: 'flex-start' }}
        />
      )}
    </div>
  );
}
