'use client';

import { useRef, useState } from 'react';
import { Upload, Camera, FolderOpen, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelected: (file: File) => void;
}

export default function FileUpload({ label, accept = 'image/*,.pdf', onFileSelected }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
      
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />

      {/* Dropzone Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
          fileName ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-300 hover:border-emerald-700 text-slate-600'
        }`}
      >
        {fileName ? (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold truncate max-w-[250px]">{fileName}</span>
          </div>
        ) : (
          <div>
            <Upload className="w-6 h-6 mx-auto mb-2 text-emerald-800" />
            <span className="text-xs font-bold block text-slate-800">Click to Upload Document / Photo</span>
            
            {/* Common Source Options Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-200 text-[10px] font-semibold text-slate-500">
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                <FolderOpen className="w-3 h-3 text-emerald-700" /> Browse Files
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                <Camera className="w-3 h-3 text-emerald-700" /> Take Photo
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                <ImageIcon className="w-3 h-3 text-emerald-700" /> Gallery / Photos
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}