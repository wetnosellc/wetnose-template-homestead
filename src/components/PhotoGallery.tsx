import { useState } from "react";

interface Photo {
  url: string;
  caption: string | null;
}

interface Props {
  photos: Photo[];
  altPrefix: string;
}

export default function PhotoGallery({ photos, altPrefix }: Props) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-video bg-stone-200 rounded-lg flex items-center justify-center text-muted-foreground">
        No photos available
      </div>
    );
  }

  const photo = photos[current];

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  return (
    <div className="w-full">
      <div className="relative rounded-lg overflow-hidden bg-stone-100">
        <img
          src={photo.url}
          alt={`${altPrefix} photo ${current + 1}`}
          className="w-full aspect-video object-cover"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
              aria-label="Previous photo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
              aria-label="Next photo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {photo.caption && (
        <p className="mt-2 text-sm text-muted-foreground text-center">{photo.caption}</p>
      )}

      {photos.length > 1 && (
        <div className="flex gap-1.5 justify-center mt-3">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-border hover:bg-muted-foreground"}`}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      )}

      {photos.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${i === current ? "border-primary" : "border-transparent"}`}
            >
              <img src={p.url} alt={`${altPrefix} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
