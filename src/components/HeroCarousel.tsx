import { useState, useEffect, useCallback } from "react";

interface Slide {
  image: string;
  alt: string;
}

interface Props {
  slides: Slide[];
  title: string;
  subtitle: string;
  hasPuppiesAvailable: boolean;
}

export default function HeroCarousel({ slides, title, subtitle, hasPuppiesAvailable }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, slides.length]);

  const textContent = (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{title}</h1>
      <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl drop-shadow">{subtitle}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        {hasPuppiesAvailable && (
          <a
            href="/litters#current"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-lg transition-colors shadow-lg"
          >
            View Available Puppies
          </a>
        )}
        <a
          href="/dogs#for-sale"
          className="inline-block bg-white/15 hover:bg-white/25 border border-white/60 text-white font-semibold px-7 py-3 rounded-lg transition-colors backdrop-blur-sm"
        >
          Adults for Sale
        </a>
      </div>
    </div>
  );

  if (slides.length === 0) {
    return (
      <div className="relative h-[75vh] bg-stone-800 flex flex-col items-center justify-center">
        {textContent}
      </div>
    );
  }

  return (
    <div className="relative h-[75vh] overflow-hidden bg-stone-900">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/65" />
        </div>
      ))}

      {textContent}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
