import React, { useEffect, useRef } from 'react';

interface VelocityMarqueeProps {
  words: string[];
  baseVelocity?: number;
  className?: string;
}

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({
  words,
  baseVelocity = -1.2,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const lastScrollY = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      velocityRef.current = delta * 0.08;
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Dampen scroll velocity
      velocityRef.current *= 0.92;

      // Base drift + scroll boost
      const move = baseVelocity + velocityRef.current;
      offsetRef.current += move;

      // Wrap around percentage (-25% boundary)
      if (offsetRef.current <= -25) {
        offsetRef.current += 25;
      } else if (offsetRef.current >= 0) {
        offsetRef.current -= 25;
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${offsetRef.current}%)`;
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [baseVelocity]);

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden border-y border-neutral-900 bg-[#070709] py-5 select-none ${className}`}
    >
      <div
        ref={containerRef}
        className="flex w-max flex-nowrap will-change-transform"
        style={{ transform: 'translateX(0%)' }}
      >
        {/* Render 4 copies for seamless wrapping */}
        {[0, 1, 2, 3].map((copyIdx) => (
          <div key={copyIdx} className="flex shrink-0 items-center">
            {words.map((word, wordIdx) => (
              <React.Fragment key={wordIdx}>
                <span className="px-6 font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors">
                  {word}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E6002B] shrink-0 mx-2 shadow-[0_0_8px_#E6002B]" />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
