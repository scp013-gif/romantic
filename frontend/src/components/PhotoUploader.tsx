import { Upload } from 'lucide-react';
import { memo } from 'react';

const PhotoUploader = memo(({ label, preview, onChange, icon, disabled }: any) => {
  return (
    <div className={`space-y-3 ${disabled ? 'opacity-50' : 'opacity-100'}`}>
      <p className="text-center font-black text-gray-500 flex items-center justify-center gap-2 uppercase tracking-tighter text-xs">{icon} {label}</p>
      <label className="group relative block aspect-square w-full rounded-[2.5rem] border-4 border-dashed border-pink-100 bg-white hover:bg-pink-50/50 hover:border-pink-300 transition-all cursor-pointer overflow-hidden shadow-sm">
        {preview ? (
          <img src={preview} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-pink-50 rounded-2xl group-hover:scale-110 transition-transform">
              <Upload size={28} className="text-pink-300" />
            </div>
            <span className="text-[10px] font-black text-pink-200 uppercase tracking-widest">选择照片</span>
          </div>
        )}
        <input type="file" className="hidden" accept="image/*" onChange={onChange} />
      </label>
    </div>
  );
});

export default PhotoUploader;
