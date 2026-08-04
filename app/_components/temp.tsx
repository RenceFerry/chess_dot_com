// @ts-nocheck

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, Download, RotateCcw } from 'lucide-react';

// ---------------------------------------------------------------------------
// ImageCropper
//
// A dependency-free crop tool: drag to move the crop box, drag corner/edge
// handles to resize it, then "Crop" draws the selected region onto an
// offscreen canvas at the image's native resolution and exports a data URL.
//
// Drop this whole file in as `app/_components/ImageCropper.tsx` (rename to
// .tsx and add types) in a Next.js App Router project. It must stay a
// Client Component since it uses refs + mouse events:
//
//   'use client';
//   export default function ImageCropper() { ... }
// ---------------------------------------------------------------------------

const HANDLE_SIZE = 14;

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 40, y: 40, width: 220, height: 220 });
  const [croppedUrl, setCroppedUrl] = useState(null);
  const [dragMode, setDragMode] = useState(null); // 'move' | 'nw' | 'ne' | 'sw' | 'se' | null

  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, crop: null });

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
      setCroppedUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setDisplaySize({ width: img.clientWidth, height: img.clientHeight });
    // Center a reasonable default crop box once we know the image size
    const w = Math.min(220, img.clientWidth * 0.6);
    const h = Math.min(220, img.clientHeight * 0.6);
    setCrop({
      x: (img.clientWidth - w) / 2,
      y: (img.clientHeight - h) / 2,
      width: w,
      height: h,
    });
  };

  const startDrag = (mode) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragMode(mode);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      crop: { ...crop },
    };
  };

  const onPointerMove = useCallback(
    (e) => {
      if (!dragMode) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      const start = dragStart.current.crop;
      const maxW = displaySize.width;
      const maxH = displaySize.height;

      setCrop((prev) => {
        let { x, y, width, height } = start;

        if (dragMode === 'move') {
          x = clamp(start.x + dx, 0, maxW - start.width);
          y = clamp(start.y + dy, 0, maxH - start.height);
        } else {
          // Resize from a corner; keep the opposite corner fixed.
          if (dragMode.includes('e')) {
            width = clamp(start.width + dx, 20, maxW - start.x);
          }
          if (dragMode.includes('s')) {
            height = clamp(start.height + dy, 20, maxH - start.y);
          }
          if (dragMode.includes('w')) {
            const newX = clamp(start.x + dx, 0, start.x + start.width - 20);
            width = start.width + (start.x - newX);
            x = newX;
          }
          if (dragMode.includes('n')) {
            const newY = clamp(start.y + dy, 0, start.y + start.height - 20);
            height = start.height + (start.y - newY);
            y = newY;
          }
        }
        return { x, y, width, height };
      });
    },
    [dragMode, displaySize]
  );

  const stopDrag = useCallback(() => setDragMode(null), []);

  useEffect(() => {
    if (!dragMode) return;
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', stopDrag);
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', stopDrag);
    };
  }, [dragMode, onPointerMove, stopDrag]);

  const performCrop = () => {
    const img = imgRef.current;
    if (!img) return;

    // Scale from displayed (CSS) pixels to the image's natural resolution,
    // so the exported crop isn't limited to screen resolution.
    const scaleX = naturalSize.width / displaySize.width;
    const scaleY = naturalSize.height / displaySize.height;

    const canvas = document.createElement('canvas');
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    setCroppedUrl(canvas.toDataURL('image/png'));
  };

  const reset = () => {
    setImageSrc(null);
    setCroppedUrl(null);
    setDragMode(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-5 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">Image cropper</h2>
        {imageSrc && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <RotateCcw size={14} />
            Start over
          </button>
        )}
      </div>

      {!imageSrc && (
        <label className="flex flex-col items-center justify-center gap-2 h-56 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
          <Upload size={28} className="text-neutral-400" />
          <span className="text-sm text-neutral-500">Click to choose an image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}

      {imageSrc && (
        <div
          ref={containerRef}
          className="relative inline-block select-none"
          style={{ lineHeight: 0 }}
        >
          <img
            ref={imgRef}
            src={imageSrc}
            onLoad={onImageLoad}
            alt="To crop"
            className="max-w-full rounded-lg block"
            draggable={false}
          />

          {/* Dimmed overlay outside the crop box */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `0 0 0 9999px rgba(0,0,0,0.45)`,
              clipPath: `polygon(evenodd)`,
              top: crop.y,
              left: crop.x,
              width: crop.width,
              height: crop.height,
            }}
          />

          {/* Crop box */}
          <div
            onMouseDown={startDrag('move')}
            className="absolute cursor-move border-2 border-white"
            style={{
              top: crop.y,
              left: crop.x,
              width: crop.width,
              height: crop.height,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
            }}
          >
            {['nw', 'ne', 'sw', 'se'].map((corner) => (
              <div
                key={corner}
                onMouseDown={startDrag(corner)}
                className="absolute bg-white border border-neutral-400 rounded-full"
                style={{
                  width: HANDLE_SIZE,
                  height: HANDLE_SIZE,
                  top: corner.includes('n') ? -HANDLE_SIZE / 2 : undefined,
                  bottom: corner.includes('s') ? -HANDLE_SIZE / 2 : undefined,
                  left: corner.includes('w') ? -HANDLE_SIZE / 2 : undefined,
                  right: corner.includes('e') ? -HANDLE_SIZE / 2 : undefined,
                  cursor: `${corner}-resize`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {imageSrc && (
        <button
          onClick={performCrop}
          className="w-full py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Crop image
        </button>
      )}

      {croppedUrl && (
        <div className="space-y-3 pt-2 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">Result</p>
          <img
            src={croppedUrl}
            alt="Cropped result"
            className="max-w-full rounded-lg border border-neutral-200"
          />
          <a
            href={croppedUrl}
            download="cropped-image.png"
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Download size={14} />
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}