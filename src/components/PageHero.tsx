import React, { ReactNode, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from '../utils/imageUrl';

export interface PageHeroProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  bgImage: string;
  fallbackImage?: string;
  altText?: string;
  bgPosition?: string;
  children?: ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  title,
  titleHighlight,
  subtitle,
  bgImage,
  fallbackImage,
  altText,
  bgPosition = 'center center',
  children
}) => {
  const initialResolved = getImageUrl(bgImage, fallbackImage || DEFAULT_FALLBACK_IMAGE);
  const [heroSrc, setHeroSrc] = useState<string>(initialResolved);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  useEffect(() => {
    const nextUrl = getImageUrl(bgImage, fallbackImage || DEFAULT_FALLBACK_IMAGE);
    setHeroSrc(nextUrl);
    setAttemptedFallback(false);
  }, [bgImage, fallbackImage]);

  const handleImageError = () => {
    if (!attemptedFallback) {
      setAttemptedFallback(true);
      const fallbackUrl = fallbackImage ? getImageUrl(fallbackImage, DEFAULT_FALLBACK_IMAGE) : DEFAULT_FALLBACK_IMAGE;
      if (heroSrc !== fallbackUrl) {
        setHeroSrc(fallbackUrl);
      }
    } else if (heroSrc !== DEFAULT_FALLBACK_IMAGE) {
      setHeroSrc(DEFAULT_FALLBACK_IMAGE);
    }
  };

  const imageAlt = altText || title || 'Premier Tours Sri Lanka Banner';

  return (
    <section className="lux-grain relative w-full h-[clamp(400px,56vh,620px)] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#0C0B0A]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroSrc}
          alt={imageAlt}
          loading="eager"
          decoding="async"
          onError={handleImageError}
          style={{ objectPosition: bgPosition }}
          className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05] saturate-[0.9] animate-[lux-kenburns_24s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/45 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(12,11,10,0.65)_100%)] pointer-events-none" />
      </div>

      {/* Hero Content - Exactly ONE visible H1 */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 sm:pt-20 pb-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center w-full max-w-4xl"
        >
          {badge && (
            <span className="lux-eyebrow lux-eyebrow-center !text-[#E6CF9B] mb-5">
              {badge}
            </span>
          )}

          {/* Single H1 Title */}
          <h1 className="font-heading text-[clamp(2.25rem,5vw,4.5rem)] font-medium tracking-[-0.01em] text-white leading-[1.05] max-w-4xl drop-shadow-md break-words">
            {title}{' '}
            {titleHighlight && (
              <em className="text-gradient-gold font-heading italic">
                {titleHighlight}
              </em>
            )}
          </h1>

          <div className="lux-divider w-40 mt-6 text-[#D4B477]">
            <span className="w-1.5 h-1.5 rotate-45 bg-current" />
          </div>

          {subtitle && (
            <p className="mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed px-2 drop-shadow-sm">
              {subtitle}
            </p>
          )}

          {children && (
            <div className="mt-5 sm:mt-6 w-full flex justify-center">
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
