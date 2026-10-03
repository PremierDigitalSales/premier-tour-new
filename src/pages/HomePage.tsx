import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Compass, Gem, ConciergeBell, MessageCircle } from 'lucide-react';
import { Tour } from '../types';
import { dataService } from '../services/dataService';
import { useLanguage } from '../context/LanguageContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { SEOHelmet } from '../components/SEOHelmet';
import { HeroSearchEngine } from '../components/HeroSearchEngine';
import { HotelPartnershipSlider } from '../components/HotelPartnershipSlider';
import { TravelExtras } from '../components/TravelExtras';
import { TourPackageCard as PackageCard } from '../components/TourPackageCard';
import { ReviewsSection } from '../components/ReviewsSection';
import { SafeImage } from '../components/ui/SafeImage';
import { BANNER_IMAGES, BANNER_LOCAL_FALLBACKS, BANNER_ALT_TEXTS, DEFAULT_FALLBACK_IMAGE } from '../config/bannerImages';
import { getImageUrl } from '../utils/imageUrl';

const unsplash = (id: string, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const DESTINATIONS = [
  { name: 'Sigiriya', region: 'Cultural Triangle', image: unsplash('photo-1588598198321-9735fd52455b', 1600), span: 'md:col-span-2 md:row-span-2' },
  { name: 'Ella', region: 'Hill Country', image: unsplash('photo-1566296314736-6eaac1ca0cb9'), span: '' },
  { name: 'Yala', region: 'Wild Safari', image: unsplash('photo-1549366021-9f761d450615'), span: '' },
  { name: 'Mirissa', region: 'Southern Coast', image: unsplash('photo-1648819955193-776922ff68b5'), span: '' },
  { name: 'Bentota', region: 'Golden Shores', image: unsplash('photo-1743592323402-2a8392831f44'), span: '' },
];

const RIBBON = ['Sigiriya', 'Ella', 'Galle Fort', 'Yala', 'Kandy', 'Mirissa', 'Nuwara Eliya', 'Trincomalee', 'Bentota', 'Jaffna'];

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

export const HomePage: React.FC = () => {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [homeHeroImg, setHomeHeroImg] = useState<string>(() => getImageUrl(BANNER_IMAGES.home, BANNER_LOCAL_FALLBACKS.home));
  const { t } = useLanguage();
  const { localizeTour } = useLocalizedContent();

  useEffect(() => {
    dataService.getTours().then((tours) => setFeaturedTours(tours.filter((tour) => tour.featured).slice(0, 3)));
  }, []);

  const handleHomeImgError = () => {
    if (homeHeroImg !== (BANNER_LOCAL_FALLBACKS.home as string)) {
      setHomeHeroImg(BANNER_LOCAL_FALLBACKS.home);
    } else if (homeHeroImg !== (DEFAULT_FALLBACK_IMAGE as string)) {
      setHomeHeroImg(DEFAULT_FALLBACK_IMAGE);
    }
  };

  const pillars = [
    { icon: Compass, title: t('home_pillar_guides', 'Private Expert Guides'), text: t('home_pillar_guides_desc', 'Chauffeur-guides and naturalists who open doors closed to ordinary travellers.') },
    { icon: Gem, title: t('home_pillar_stays', 'Handpicked Luxury Stays'), text: t('home_pillar_stays_desc', 'Boutique villas, heritage manors and five-star sanctuaries we know personally.') },
    { icon: ConciergeBell, title: t('home_pillar_concierge', '24/7 Personal Concierge'), text: t('home_pillar_concierge_desc', 'One dedicated travel designer, from first sketch to final farewell.') },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SEOHelmet
        title="Premier Tours Sri Lanka | Luxury Tours & Travel"
        description="Experience the ultimate luxury travel in Sri Lanka. Tailor-made itineraries, 5-star resorts, private chauffeurs, and exclusive wildlife safaris."
        image={BANNER_IMAGES.home}
        path="/"
      />

      {/* ───────────── Hero ───────────── */}
      <section className="lux-grain relative min-h-[100svh] flex items-center overflow-hidden bg-[#0C0B0A] pt-28 pb-24">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            src={homeHeroImg}
            alt={BANNER_ALT_TEXTS.home}
            loading="eager"
            decoding="async"
            onError={handleHomeImgError}
            className="w-full h-full object-cover object-center brightness-[0.8] saturate-[0.95]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0C0B0A] to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <span className="lux-eyebrow !text-[#E6CF9B] mb-7">
              {t('hero_badge2') || 'Sri Lanka, Wonder Awaits'}
            </span>

            <h1 className="font-heading text-white font-medium leading-[0.98] tracking-[-0.015em] text-[clamp(2.75rem,5.4vw,5rem)] mb-7">
              <span className="block">{t('hero_title_1') || 'Discover the World,'}</span>
              <em className="block italic text-gradient-gold pb-2">{t('hero_title_2') || 'Perfected For You'}</em>
            </h1>

            <p className="text-base sm:text-lg text-white/75 font-light leading-relaxed max-w-xl mb-10">
              {t('hero_desc') || 'Handpicked tours, luxury resorts, and bespoke experiences designed for the modern traveler.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link to="/tours" className="lux-btn-gold">
                {t('home_cta_explore', 'Explore Journeys')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="lux-btn-outline">
                {t('home_cta_plan', 'Plan My Trip')}
              </Link>
            </div>

            <div className="flex items-center gap-8 sm:gap-12">
              {[
                { value: '4.9', suffix: '/5', label: t('home_rating') || 'Rating' },
                { value: '12K', suffix: '+', label: t('home_travelers') || 'Travelers' },
                { value: '2018', suffix: '', label: t('home_since', 'Since') },
              ].map((stat, i) => (
                <div key={stat.label} className={`${i > 0 ? 'pl-8 sm:pl-12 border-l border-white/15' : ''}`}>
                  <p className="font-heading text-3xl sm:text-4xl text-white leading-none">
                    {stat.value}
                    <span className="text-[#D4B477] text-xl sm:text-2xl">{stat.suffix}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/55 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md lg:max-w-lg relative z-20">
              <HeroSearchEngine />
            </div>
          </motion.div>
        </div>

        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-3 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.35em]">{t('home_scroll', 'Scroll')}</span>
          <span className="relative w-[22px] h-9 rounded-full border border-white/40">
            <span className="lux-scroll-dot absolute left-1/2 top-2 -ml-[2px] w-1 h-1.5 rounded-full bg-[#E6CF9B]" />
          </span>
        </div>
      </section>

      {/* ───────────── Destination ribbon ───────────── */}
      <div className="relative bg-[#0C0B0A] border-y border-[#D4B477]/15 py-6 overflow-hidden">
        <div className="lux-marquee-track flex w-max items-center">
          {[...RIBBON, ...RIBBON].map((place, i) => (
            <span key={i} className="flex items-center font-heading italic text-2xl md:text-3xl text-white/80 whitespace-nowrap">
              <span className="px-8">{place}</span>
              <span className="text-[#D4B477] text-sm not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───────────── Philosophy ───────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div {...fadeUp} className="relative pb-16 sm:pb-20 pr-10 sm:pr-16">
            <div className="lux-frame relative aspect-[4/5] overflow-hidden rounded-t-[200px] rounded-b-sm shadow-[0_40px_80px_-30px_rgba(60,45,20,0.45)]">
              <SafeImage
                src={unsplash('photo-1571896349842-33c89424de2d', 1200)}
                alt="Luxury resort pool at dusk"
                wrapperClassName="!absolute inset-0"
                className="transition-transform duration-[1.6s] ease-out hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[48%] aspect-square overflow-hidden rounded-sm border-[10px] border-[var(--background)] shadow-2xl">
              <SafeImage
                src={unsplash('photo-1566073771259-6a8506099945', 800)}
                alt="Private villa with infinity pool"
                wrapperClassName="!absolute inset-0"
              />
            </div>
            <div className="absolute top-10 -left-2 sm:-left-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#0C0B0A] text-[#E6CF9B] flex flex-col items-center justify-center text-center shadow-2xl ring-1 ring-[#D4B477]/40">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/60">{t('home_est', 'Est.')}</span>
              <span className="font-heading text-3xl sm:text-4xl leading-none my-1">2018</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/60">Sri Lanka</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <span className="lux-eyebrow mb-6">{t('home_philosophy', 'Our Philosophy')}</span>
            <h2 className="font-heading text-[clamp(2.3rem,4.4vw,3.8rem)] leading-[1.05] font-medium text-[var(--text)] mb-7">
              {t('home_philosophy_title_1', 'Journeys of quiet luxury,')}{' '}
              <em className="italic text-[var(--primary)]">{t('home_philosophy_title_2', 'crafted by hand.')}</em>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg font-light leading-relaxed mb-12 max-w-xl">
              {t('home_philosophy_desc', 'We believe the finest journeys are felt, not just seen. Every itinerary is designed privately around you — unhurried, deeply personal and quietly extraordinary, from misty tea highlands to sun-drenched southern shores.')}
            </p>

            <div className="space-y-8 mb-12">
              {pillars.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-5 group">
                  <div className="w-14 h-14 shrink-0 rounded-full border border-[var(--border-hover)] flex items-center justify-center text-[var(--primary)] transition-all duration-500 group-hover:bg-[var(--primary)] group-hover:text-white dark:group-hover:text-[#0C0B0A]">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-medium text-[var(--text)] mb-1">{title}</h3>
                    <p className="text-[var(--muted)] font-light leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/about" className="lux-link">
              {t('home_our_story', 'Discover Our Story')} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ───────────── Featured Expeditions ───────────── */}
      {featuredTours.length > 0 && (
        <section className="py-24 md:py-28 bg-[var(--atmospheric)] dark:bg-[#100F0D] border-y border-[var(--border-subtle)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <div>
                <span className="lux-eyebrow mb-5">{t('home_curated') || 'Curated Itineraries'}</span>
                <h2 className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.05] font-medium text-[var(--text)]">
                  {t('home_featured') || 'Featured Expeditions'}
                </h2>
              </div>
              <Link to="/tours" className="lux-link self-start md:self-auto">
                {t('common_view_all') || 'View All'} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((rawTour, index) => {
                const tour = localizeTour(rawTour);
                return (
                  <PackageCard
                    key={tour.id}
                    id={tour.id}
                    index={index}
                    title={tour.title}
                    category={`${tour.category} ${t('common_expedition') || 'EXPEDITION'}`}
                    location={tour.location}
                    duration={tour.duration_days}
                    maxGuests={tour.max_group_size}
                    featured={tour.featured}
                    rating={tour.rating}
                    reviewsCount={tour.review_count}
                    imageUrl={tour.image_urls?.[0] || tour.image_url}
                    linkTo={`/tours/${tour.id}`}
                    price={tour.price}
                    priceUnit="guest"
                    highlights={tour.highlights && tour.highlights.length > 0 ? tour.highlights.slice(0, 2) : [`${tour.duration_days} ${t('common_days') || 'Days'}`, tour.location.split(',')[0]]}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── Signature Destinations ───────────── */}
      <section className="lux-grain relative py-24 md:py-32 bg-[#0C0B0A] text-white overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#C5A059]/10 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="lux-eyebrow lux-eyebrow-center !text-[#D4B477] mb-5">{t('home_destinations_badge', 'Signature Destinations')}</span>
            <h2 className="font-heading text-[clamp(2.3rem,4.4vw,3.8rem)] leading-[1.05] font-medium mb-5">
              {t('home_destinations_title_1', 'An island of')}{' '}
              <em className="italic text-gradient-gold">{t('home_destinations_title_2', 'endless wonder')}</em>
            </h2>
            <p className="text-white/60 font-light text-lg">
              {t('home_destinations_desc', 'Ancient citadels, emerald tea country, untamed safaris and golden coastlines — all within a single, unforgettable journey.')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[640px]">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`${dest.span} h-72 md:h-auto`}
              >
                <Link
                  to={`/tours?q=${encodeURIComponent(dest.name)}`}
                  className="lux-frame group relative block w-full h-full overflow-hidden rounded-sm"
                >
                  <SafeImage
                    src={dest.image}
                    alt={`${dest.name}, Sri Lanka`}
                    wrapperClassName="!absolute inset-0"
                    className="transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-10 flex items-end justify-between gap-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-[0.3em] text-[#E6CF9B] mb-2">{dest.region}</span>
                      <h3 className={`font-heading font-medium leading-none ${i === 0 ? 'text-4xl md:text-6xl' : 'text-3xl'}`}>{dest.name}</h3>
                    </div>
                    <span className="w-11 h-11 shrink-0 rounded-full border border-white/40 flex items-center justify-center transition-all duration-500 group-hover:bg-[#D4B477] group-hover:border-[#D4B477] group-hover:text-[#0C0B0A] group-hover:rotate-45">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Hotel Partners ───────────── */}
      <section className="py-24 md:py-28">
        <HotelPartnershipSlider />
      </section>

      {/* ───────────── Guest Stories ───────────── */}
      <section className="relative z-10 pt-24 bg-[var(--atmospheric)] dark:bg-[#100F0D] border-y border-[var(--border-subtle)]">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
          <span className="lux-eyebrow lux-eyebrow-center mb-5">{t('home_stories') || 'Traveler Stories'}</span>
          <h2 className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.05] font-medium text-[var(--text)] mb-4">
            {t('home_guests_say') || 'What Our Guests Say'}
          </h2>
          <p className="font-heading italic text-xl text-[var(--muted)]">“{t('home_real_journeys') || 'Real journeys. Real experiences.'}”</p>
        </motion.div>
        <ReviewsSection />
        <div className="flex justify-center pb-24">
          <Link to="/reviews" className="lux-link">
            {t('home_view_all_reviews') || 'View All Reviews'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ───────────── Bespoke CTA ───────────── */}
      <section className="lux-grain relative py-32 md:py-44 overflow-hidden bg-[#0C0B0A]">
        <SafeImage
          src={unsplash('photo-1586861635167-e5223aadc9fe', 1920)}
          alt="Floating breakfast in a private infinity pool"
          wrapperClassName="!absolute inset-0"
          className="brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0B0A]/70 via-[#0C0B0A]/40 to-[#0C0B0A]/80" />
        <motion.div {...fadeUp} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="lux-eyebrow lux-eyebrow-center !text-[#E6CF9B] mb-6">{t('home_bespoke_badge', 'Bespoke Travel')}</span>
          <h2 className="font-heading text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] font-medium mb-6">
            {t('home_bespoke_title_1', 'Your private journey begins')}{' '}
            <em className="italic text-gradient-gold">{t('home_bespoke_title_2', 'with a conversation.')}</em>
          </h2>
          <p className="text-white/70 text-lg font-light leading-relaxed mb-10 max-w-xl mx-auto">
            {t('home_bespoke_desc', 'Share your dream with one of our travel designers and receive a hand-crafted itinerary within 24 hours — no obligation, simply inspiration.')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="lux-btn-gold">
              {t('home_bespoke_cta', 'Design My Journey')} <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/94112345678" target="_blank" rel="noopener noreferrer" className="lux-btn-outline">
              <MessageCircle className="w-4 h-4" /> {t('home_bespoke_whatsapp', 'WhatsApp Concierge')}
            </a>
          </div>
        </motion.div>
      </section>

      {/* ───────────── Trust Extras ───────────── */}
      <div className="relative z-10">
        <TravelExtras />
      </div>
    </div>
  );
};
