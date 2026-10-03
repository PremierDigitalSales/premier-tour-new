import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, MapPin, Clock, Users, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { SafeImage } from './ui/SafeImage';

export interface PackageCardProps {
  id: string;
  title: string;
  category: string;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  imageUrls?: string[];
  linkTo: string;
  price: number;
  priceUnit?: string;
  duration?: string | number;
  maxGuests?: number;
  highlights?: string[];
  availabilityText?: string;
  featured?: boolean;
  badgeText?: string;
  onBook?: (e: React.MouseEvent) => void;
  bookButtonText?: string;
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  index?: number;
  staggerDelay?: number;
}

export const TourPackageCard: React.FC<PackageCardProps> = ({
  id,
  title,
  category,
  location,
  rating = 4.9,
  reviewsCount = 28,
  imageUrl,
  imageUrls,
  linkTo,
  price,
  priceUnit = 'guest',
  duration,
  maxGuests,
  highlights = [],
  availabilityText = 'Instant Confirmation',
  featured = false,
  badgeText,
  onBook,
  isWishlisted = false,
  onWishlistToggle,
  index = 0,
  staggerDelay,
}) => {
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [isLiked, setIsLiked] = useState(isWishlisted);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Staggered Entrance Animation via IntersectionObserver & Reduced Motion Support
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Observe element entering viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const delayMs = staggerDelay !== undefined 
    ? staggerDelay 
    : (index !== undefined ? (index % 8) * 80 : 0);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onWishlistToggle) {
      onWishlistToggle(id);
    }
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    if (onBook) {
      e.preventDefault();
      e.stopPropagation();
      onBook(e);
    }
  };

  // Derive location or duration if highlights exist
  const displayLocation = location || (category.includes(',') ? category : undefined);

  return (
    <div
      ref={cardRef}
      id={`package-card-${id}`}
      style={{
        transitionDelay: isVisible ? `${delayMs}ms` : '0ms',
      }}
      className={`group bg-[#FFFFFF] dark:bg-[#161412] border border-[var(--card-border)] rounded-2xl shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-1.5 hover:border-[var(--border-hover)] flex flex-col h-full overflow-hidden p-3 sm:p-3.5 select-none cursor-pointer duration-300 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-[18px]'
      }`}
    >
      <Link to={linkTo} className="flex flex-col h-full justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-[20px]">
        {/* Top Image Viewport Container */}
        <div>
          <div className="relative aspect-[4/3] w-full rounded-[18px] overflow-hidden bg-[#F6F2EA] dark:bg-[#161412]">
            {/* Main Image with Smooth Natural Zoom */}
            <SafeImage
              src={imageUrl || (imageUrls && imageUrls[0]) || null}
              fallbackSrc="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80"
              alt={title}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Subtle Gradient Shadow for Crisp Badge & Contrast Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

            {/* Top-Left: Category / Featured Pill */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C5A059]/10 dark:bg-[#C5A059]/20 backdrop-blur-sm border border-[#C5A059]/20 dark:border-[#C5A059]/30 text-[#6E5024] dark:text-[#D4B477] font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-xs">
                {featured && <Sparkles className="w-3 h-3 text-[#C5A059] shrink-0" />}
                <span className="truncate max-w-[150px] sm:max-w-[180px]">{badgeText || category}</span>
              </span>
            </div>

            {/* Top-Right: Star Rating Pill & Wishlist Heart */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              {/* Rating Pill */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#161412] border border-[#C5A059]/20 dark:border-[#C5A059]/30 text-[#1F1B16] dark:text-[#F1EBE0] text-xs font-bold shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span>{rating.toFixed(1)}</span>
                {reviewsCount > 0 && (
                  <span className="text-[10px] font-medium text-slate-400 dark:text-[var(--muted)]">
                    ({reviewsCount})
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                aria-label={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
                onClick={handleHeartClick}
                className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500 text-white border-rose-400 shadow-sm scale-105'
                    : 'bg-black/35 hover:bg-black/55 text-white/90 hover:text-white border-white/20'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Bottom Overlay on Image: Location & Instant Confirmation */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
              {displayLocation ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-[11px] font-medium border border-white/15 max-w-[70%] truncate shadow-xs">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{displayLocation}</span>
                </div>
              ) : (
                <div />
              )}

              {availabilityText && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6EEDC] dark:bg-[#221F1A] text-[#C5A059] dark:text-[#D4B477] text-[10px] font-semibold border border-[#C5A059]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                  <span className="truncate">{availabilityText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card Body Information */}
          <div className="pt-3.5 px-1.5 pb-1">
            {/* Region / Category Subtitle */}
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
              <span>{t('common_expedition') || 'Sri Lanka Expedition'}</span>
              {duration && (
                <span className="flex items-center gap-1 text-[var(--muted)] dark:text-[var(--muted)] font-medium normal-case">
                  <Clock className="w-3 h-3 text-[#C5A059]" />
                  {typeof duration === 'number' ? `${duration} ${t('common_days') || 'Days'}` : duration}
                </span>
              )}
            </div>

            {/* Package Title */}
            <h3 className="font-heading font-semibold text-[22px] sm:text-2xl text-[#1F1B16] dark:text-white leading-[1.15] line-clamp-2 min-h-[3.3rem] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200">
              {title}
            </h3>

            {/* Highlights / Features Row */}
            {highlights && highlights.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {highlights.slice(0, 2).map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-[#0C0B0A]/40 text-emerald-900 dark:text-[var(--text-secondary)] text-[11px] font-medium border border-emerald-100 dark:border-[var(--border-subtle)] truncate max-w-[200px]"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{item}</span>
                  </span>
                ))}
                {maxGuests && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[var(--surface)] text-slate-600 dark:text-[var(--text-secondary)] text-[11px] font-medium">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{t('common_max') || 'Max'} {maxGuests}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Starting Price & Luxury Circle CTA */}
        <div className="pt-3 px-1.5 mt-3 border-t border-[#C5A059]/15 dark:border-[#C5A059]/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7D7468] dark:text-[#A39A8B] leading-none mb-0.5">
              {t('common_from') || 'From'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-[28px] font-heading font-semibold text-[#1F1B16] dark:text-white leading-none">
                {formatPrice(price)}
              </span>
              <span className="text-[11px] text-[#7D7468] dark:text-[#A39A8B] font-medium">
                /{priceUnit === 'guest' ? (t('common_guest') || 'guest') : priceUnit === 'night' ? (t('common_night') || 'night') : priceUnit}
              </span>
            </div>
          </div>

          {/* Action CTA Circle Button */}
          <div
            onClick={handleCtaClick}
            className="btn-circle-cta transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-45deg]"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </div>
  );
};

