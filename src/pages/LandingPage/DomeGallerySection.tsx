import { type FC, useRef, useEffect, useState } from 'react';

interface ImageData {
  src: string;
  alt?: string;
  label?: string;
}

interface InfiniteScrollGalleryProps {
  images?: ImageData[];
  scrollSpeed?: number;
  grayscale?: boolean;
}

const DEFAULT_IMAGES: ImageData[] = [
  { src: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format', alt: 'Santorini', label: 'Santorini' },
  { src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format', alt: 'Blurry Lights', label: 'Blurry Lights' },
  { src: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format', alt: 'New York', label: 'New York' },
  { src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format', alt: 'Good Boy', label: 'Good Boy' },
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format', alt: 'Coastline', label: 'Coastline' },
  { src: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format', alt: 'Happy Customers', label: 'Happy Customers' },
  { src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format', alt: 'Car Rental', label: 'Car Rental' },
  { src: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format', alt: 'Premium Service', label: 'Premium Service' },
];

const InfiniteScrollGallery: FC<InfiniteScrollGalleryProps> = ({
  images = DEFAULT_IMAGES,
  scrollSpeed = 1,
  grayscale = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Auto-scroll animation
  useEffect(() => {
    const animate = () => {
      setScrollPosition((prev) => prev + scrollSpeed);
    };

    const intervalId = setInterval(animate, 16); // ~60fps

    return () => clearInterval(intervalId);
  }, [scrollSpeed]);

  // Reset scroll when reaching the end of the first set
  useEffect(() => {
    const scrollWidth = images.length * 260; // 240px width + 20px gap
    if (scrollPosition >= scrollWidth) {
      setScrollPosition(0);
    }
  }, [scrollPosition, images.length]);

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <div
      style={{
        width: '100%',
        height: '350px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blur gradients on edges */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '200px',
          background: 'linear-gradient(to right, #0A0A0A 0%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '200px',
          background: 'linear-gradient(to left, #0A0A0A 0%, transparent 100%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* Scrolling content */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '20px',
          transform: `translateX(-${scrollPosition}px)`,
          transition: 'none',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            style={{
              minWidth: '240px',
              height: '300px',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              backgroundColor: '#1a1a1a',
              flexShrink: 0,
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: grayscale ? 'grayscale(100%)' : 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Infinite Scroll Gallery Section showcasing satisfied customers
 */
export const InfiniteScrollGallerySection: FC = () => {
  return (
    <section 
      className="bg-[#0A0A0A] py-16 sm:py-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="mx-auto w-full" style={{ maxWidth: '100vw' }}>
        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center px-6">
          Memories From Our Satisfied Customers
        </h2>

        {/* Infinite Scroll Gallery */}
        <InfiniteScrollGallery />
      </div>
    </section>
  );
};
