import React, { useState, useRef } from "react";
import { Upload, X, FileVideo, ImageIcon, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  accept?: "image/*" | "video/*" | "image/*,video/*";
  aspectRatio?: "video" | "portrait" | "square" | "any";
  className?: string;
}

import { cmsService } from "../../lib/cms-service";

export function MediaUploader({ 
  value, 
  onChange, 
  label, 
  accept = "image/*", 
  aspectRatio = "any",
  className 
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    try {
      const bucket = accept.includes("video") ? "gallery-images" : "project-images";
      const publicUrl = await cmsService.uploadMedia(file, bucket);
      onChange(publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("System Error: Media Ingestion Failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isVideo = value?.includes("video") || value?.endsWith(".mp4");

  return (
    <div className={cn("space-y-4 group/uploader", className)}>
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40 group-focus-within/uploader:opacity-100 transition-opacity">
          {label}
        </label>
        {value && (
          <button 
            onClick={() => onChange("")}
            className="text-[10px] font-black tracking-[0.1em] uppercase text-[#ef4444] hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <X className="w-3 h-3" />
            CLEAR ASSET
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center group",
          aspectRatio === "video" ? "aspect-video" : 
          aspectRatio === "portrait" ? "aspect-[9/16]" : 
          aspectRatio === "square" ? "aspect-square" : "min-h-[200px]",
          isDragging ? "border-black bg-black/5 scale-[0.99]" : "border-black/5 hover:border-black/20 bg-[#fafafa]",
          value ? "border-solid border-black/10" : ""
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onSelect} 
          accept={accept} 
          className="hidden" 
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-8 h-8 animate-spin opacity-20" />
              <span className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40">PROCESSING CINEMATIC ASSET...</span>
            </motion.div>
          ) : value ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              {isVideo ? (
                <video src={value} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" autoPlay muted loop />
              ) : (
                <img src={value} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Preview" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white">REPLACE MEDIA PROTOCOL</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6 p-12 text-center"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center group-hover:scale-110 group-hover:border-black/20 transition-all duration-700">
                  {accept.includes("video") ? <FileVideo className="w-6 h-6 opacity-20" /> : <ImageIcon className="w-6 h-6 opacity-20" />}
                </div>
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Upload className="w-4 h-4 text-[#ef4444]" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase">DRAG & DROP RAW MEDIA</p>
                <p className="text-[8px] font-medium opacity-30 uppercase tracking-[0.1em]">OR CLICK TO BROWSE SYSTEM FILES</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Branding Decoration */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-[0.05] pointer-events-none">
          <Check className="w-3 h-3" />
          <span className="text-[8px] font-black tracking-widest uppercase">READY FOR INGESTION</span>
        </div>
      </div>
    </div>
  );
}
